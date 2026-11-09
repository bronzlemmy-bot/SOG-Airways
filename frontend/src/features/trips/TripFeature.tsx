
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Database,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";



import Modal from "@/components/modals/Modal";


import { TRIP_FILTERS, TRIP_SORT_OPTIONS } from "@/constants/trip";
import { useTrips } from "@/hooks/useTrips";
import type { Trip } from "@/types";
import type { CreateTripData } from "@/services/tripService";

import TripDetails from "./components/TripDetails";
import TripFilters from "./components/TripFilters";
import TripForm from "./components/TripForm";
import TripHeader from "./components/TripHeader";
import TripStats from "./components/TripStats";
import TripTable from "./components/TripTable";
import { getTripDemoData } from "./data/tripDemoData";

type TripFilterValue = (typeof TRIP_FILTERS)[number];
type TripSortValue = (typeof TRIP_SORT_OPTIONS)[number];

type PendingAction =
  | { type: "cancel"; trip: Trip }
  | { type: "delete"; trip: Trip }
  | null;

const DEFAULT_SORT: TripSortValue = "date-desc";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function matchesTripSearch(trip: Trip, search: string): boolean {
  if (!search) return true;

  const searchableValues = [
    trip.id,
    trip.userId,
    trip.bookingId,
    trip.bookingReference,
    trip.title ?? "",
    trip.destination ?? "",
    trip.type,
    trip.status,
    ...trip.segments.flatMap((segment) => [
      segment.flightId,
      segment.flightNumber,
      segment.departureAirportCode,
      segment.departureAirportName,
      segment.arrivalAirportCode,
      segment.arrivalAirportName,
    ]),
  ];

  const normalizedSearch = search.toLowerCase();

  return searchableValues.some((value) =>
    value.toLowerCase().includes(normalizedSearch),
  );
}

function sortTrips(
  trips: Trip[],
  sortBy: TripSortValue,
): Trip[] {
  const statusOrder = [
    "upcoming",
    "in-progress",
    "completed",
    "cancelled",
  ];

  return [...trips].sort((first, second) => {
    switch (sortBy) {
      case "date-asc":
        return first.startDate.localeCompare(second.startDate);

      case "date-desc":
        return second.startDate.localeCompare(first.startDate);

      case "destination-asc":
        return (first.destination ?? "").localeCompare(
          second.destination ?? "",
        );

      case "destination-desc":
        return (second.destination ?? "").localeCompare(
          first.destination ?? "",
        );

      case "status":
        return (
          statusOrder.indexOf(first.status) -
          statusOrder.indexOf(second.status)
        );

      default:
        return 0;
    }
  });
}

function createDemoTrip(data: CreateTripData): Trip {
  const now = new Date().toISOString();

  return {
    ...data,
    id: `trip-demo-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
    segments: data.segments.map((segment) => ({ ...segment })),
  };
}

export default function TripFeature() {
  const {
    trips: apiTrips,
    selectedTrip: apiSelectedTrip,
    loading,
    error: apiError,
    fetchTrips,
    createTrip,
    updateTrip,
    cancelTrip,
    deleteTrip,
    clearSelectedTrip,
    clearError,
  } = useTrips();

  const [demoTrips, setDemoTrips] = useState<Trip[]>(() =>
    getTripDemoData(),
  );

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [demoNotice, setDemoNotice] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TripFilterValue>("all");
  const [sortBy, setSortBy] = useState<TripSortValue>(DEFAULT_SORT);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const allTrips = isDemoMode ? demoTrips : apiTrips;

  // Initial load: try the real API, then fall back to in-memory examples.
  useEffect(() => {
    let isMounted = true;

    void fetchTrips()
      .then(() => {
        if (!isMounted) return;

        setIsDemoMode(false);
        setDemoNotice("");
        setHasLoaded(true);
      })
      .catch(() => {
        if (!isMounted) return;

        setIsDemoMode(true);
        setDemoTrips(getTripDemoData());
        setDemoNotice(
          "The trips API is currently unavailable. You are viewing sample data that is kept in memory and will reset when this page is reloaded.",
        );
        setHasLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [fetchTrips]);

  const filteredTrips = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = allTrips.filter((trip) => {
      const matchesSearch = matchesTripSearch(trip, normalizedSearch);

      const matchesStatus =
        status === "all" || trip.status === status;

      const matchesStart =
        !startDate || trip.endDate >= startDate;

      const matchesEnd =
        !endDate || trip.startDate <= endDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesStart &&
        matchesEnd
      );
    });

    return sortTrips(filtered, sortBy);
  }, [allTrips, search, status, startDate, endDate, sortBy]);

  const handleRefreshTrips = useCallback(async () => {
    setIsRefreshing(true);
    setFeatureError("");
    clearError();

    try {
      await fetchTrips();

      setIsDemoMode(false);
      setDemoNotice("");
    } catch {
      setIsDemoMode(true);
      setDemoTrips(getTripDemoData());
      setDemoNotice(
        "The trips API is unavailable. Sample data is being displayed instead.",
      );
    } finally {
      setHasLoaded(true);
      setIsRefreshing(false);
    }
  }, [fetchTrips, clearError]);

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setSortBy(DEFAULT_SORT);
    setStartDate("");
    setEndDate("");
  }

  function openCreateForm() {
    setFeatureError("");
    setEditingTrip(null);
    setIsFormOpen(true);
  }

  function openEditForm(trip: Trip) {
    setFeatureError("");
    setIsDetailsOpen(false);
    setSelectedTrip(null);
    setEditingTrip(trip);
    setIsFormOpen(true);
  }

  function openTripDetails(trip: Trip) {
    setSelectedTrip(trip);
    setIsDetailsOpen(true);
  }

  function closeTripDetails() {
    setIsDetailsOpen(false);
    setSelectedTrip(null);
    clearSelectedTrip();
  }

  function requestCancelTrip(trip: Trip) {
    setIsDetailsOpen(false);
    setFeatureError("");
    setPendingAction({ type: "cancel", trip });
  }

  function requestDeleteTrip(trip: Trip) {
    setFeatureError("");
    setPendingAction({ type: "delete", trip });
  }

  async function handleSubmitTrip(data: CreateTripData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeatureError("");

    try {
      if (isDemoMode) {
        if (editingTrip) {
          const now = new Date().toISOString();

          const updatedTrip: Trip = {
            ...editingTrip,
            ...data,
            id: editingTrip.id,
            createdAt: editingTrip.createdAt,
            updatedAt: now,
            segments: data.segments.map((segment) => ({
              ...segment,
            })),
          };

          setDemoTrips((previous) =>
            previous.map((trip) =>
              trip.id === editingTrip.id ? updatedTrip : trip,
            ),
          );
        } else {
          const newTrip = createDemoTrip(data);

          setDemoTrips((previous) => [newTrip, ...previous]);
        }
      } else if (editingTrip) {
        await updateTrip(editingTrip.id, data);
      } else {
        await createTrip(data);
      }

      setIsFormOpen(false);
      setEditingTrip(null);
    } catch (error) {
      setFeatureError(getErrorMessage(error));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmPendingAction() {
    if (!pendingAction || isProcessingAction) return;

    setIsProcessingAction(true);
    setFeatureError("");

    try {
      const { type, trip } = pendingAction;

      if (isDemoMode) {
        if (type === "cancel") {
          setDemoTrips((previous) =>
            previous.map((item) =>
              item.id === trip.id
                ? {
                    ...item,
                    status: "cancelled",
                    updatedAt: new Date().toISOString(),
                    segments: item.segments.map((segment) => ({
                      ...segment,
                      status: "cancelled",
                    })),
                  }
                : item,
            ),
          );
        } else {
          setDemoTrips((previous) =>
            previous.filter((item) => item.id !== trip.id),
          );
        }
      } else if (type === "cancel") {
        await cancelTrip(trip.id);
      } else {
        await deleteTrip(trip.id);
      }

      setPendingAction(null);
      setIsDetailsOpen(false);
      setSelectedTrip(null);
      clearSelectedTrip();
    } catch (error) {
      setFeatureError(getErrorMessage(error));
    } finally {
      setIsProcessingAction(false);
    }
  }

  const confirmationTitle =
    pendingAction?.type === "cancel"
      ? "Cancel this trip?"
      : "Delete this trip?";

  const confirmationDescription =
    pendingAction?.type === "cancel"
      ? `Trip ${pendingAction.trip.bookingReference} will be marked as cancelled. This action may affect the trip and its associated flight segments.`
      : `This will permanently remove trip ${pendingAction?.trip.bookingReference ?? ""} from the current data source. This cannot be undone.`;

  const visibleError = isDemoMode ? "" : featureError || apiError || "";

  return (
    <div className="space-y-7">
      <TripHeader
        totalTrips={allTrips.length}
        onCreate={openCreateForm}
        onRefresh={() => {
          void handleRefreshTrips();
        }}
        isLoading={loading || isRefreshing}
      />

      {isDemoMode && hasLoaded && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <Database
            size={19}
            className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300"
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Demo mode
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-300">
              {demoNotice}
            </p>
          </div>
        </div>
      )}

      {visibleError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30"
        >
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600 dark:text-red-300"
            aria-hidden="true"
          />

          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">
              Unable to complete the trip operation
            </p>
            <p className="mt-1 break-words text-sm text-red-700 dark:text-red-300">
              {visibleError}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFeatureError("");
              clearError();
            }}
            aria-label="Dismiss error"
            className="rounded-lg p-1 text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/40"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      <TripStats
        trips={allTrips}
        isLoading={!hasLoaded || loading}
      />

      <TripFilters
        search={search}
        status={status}
        sortBy={sortBy}
        startDate={startDate}
        endDate={endDate}
        totalCount={allTrips.length}
        filteredCount={filteredTrips.length}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSortBy}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onReset={resetFilters}
      />

      {!hasLoaded ? (
        <div
          aria-live="polite"
          className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-12 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <LoaderCircle
            size={20}
            className="animate-spin text-blue-600"
            aria-hidden="true"
          />
          Loading trip records...
        </div>
      ) : (
        <TripTable
          trips={filteredTrips}
          isLoading={loading || isRefreshing}
          error={!isDemoMode ? apiError : null}
          onRetry={() => {
            void handleRefreshTrips();
          }}
          onView={openTripDetails}
          onEdit={openEditForm}
          onCancel={requestCancelTrip}
          onDelete={requestDeleteTrip}
        />
      )}

      <TripDetails
        trip={selectedTrip ?? apiSelectedTrip}
        isOpen={isDetailsOpen}
        onClose={closeTripDetails}
        onEdit={openEditForm}
        onCancel={requestCancelTrip}
      />

      <TripForm
        isOpen={isFormOpen}
        initialTrip={editingTrip}
        onClose={() => {
          if (isSubmitting) return;

          setIsFormOpen(false);
          setEditingTrip(null);
        }}
        onSubmit={handleSubmitTrip}
        isSubmitting={isSubmitting || loading}
      />

      <Modal
        isOpen={Boolean(pendingAction)}
        onClose={() => {
          if (isProcessingAction) return;
          setPendingAction(null);
        }}
        title={confirmationTitle}
        description={confirmationDescription}
        size="md"
        showCloseButton
        closeOnOverlayClick={!isProcessingAction}
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300"
              aria-hidden="true"
            />

            <p className="text-sm leading-6 text-amber-900 dark:text-amber-200">
              {pendingAction?.type === "cancel"
                ? "Please confirm before changing this trip's status."
                : "Please confirm you want to remove this trip."}
            </p>
          </div>

          {featureError && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
            >
              {featureError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                if (isProcessingAction) return;
                setPendingAction(null);
                setFeatureError("");
              }}
              disabled={isProcessingAction}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Keep trip
            </button>

            <button
              type="button"
              onClick={() => {
                void confirmPendingAction();
              }}
              disabled={isProcessingAction}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                pendingAction?.type === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {isProcessingAction ? (
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : pendingAction?.type === "delete" ? (
                <Trash2 size={16} aria-hidden="true" />
              ) : (
                <AlertCircle size={16} aria-hidden="true" />
              )}

              {isProcessingAction
                ? "Processing..."
                : pendingAction?.type === "delete"
                  ? "Delete trip"
                  : "Confirm cancellation"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
