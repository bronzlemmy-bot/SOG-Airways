
"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { useSupport } from "@/hooks/useSupport";

import type {
  AuthUserSummary,
  SupportApiCategory,
  SupportTicket as ApiSupportTicket,
} from "@/types";

import type {
  SupportMessage,
  SupportTicket as UiSupportTicket,
} from "@/components/user/support/support-data/SupportData";

import { supportTopics } from "@/components/user/support/support-data/SupportData";

import SupportCategorySelector from "./components/SupportCategorySelector";
import SupportContactOptions from "./components/SupportContactOptions";
import SupportHeader from "./components/SupportHeader";
import SupportSearch from "./components/SupportSearch";
import SupportTicketForm, {
  type SupportTicketSubmission,
  type SupportTicketSubmissionResult,
} from "./components/SupportTicketForm";
import SupportTicketList from "./components/SupportTicketList";
import TicketDetails from "./components/SupportTicketDetails";

import { getSupportDemoData } from "./data/supportDemoData";

type SupportMode = "loading" | "api" | "demo";

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    booking: "Booking & Reservations",
    flight: "Flights & Travel",
    "check-in": "Check-in & Boarding",
    check_in: "Check-in & Boarding",
    baggage: "Baggage",
    payment: "Payments & Refunds",
    refund: "Payments & Refunds",
    account: "Account & Profile",
    technical: "Other",
    other: "Other",
  };

  return labels[category] ?? category;
}

function getCategoryId(category: string): string {
  const ids: Record<string, string> = {
    "Booking & Reservations": "booking",
    "Flights & Travel": "flight",
    "Check-in & Boarding": "check-in",
    Baggage: "baggage",
    "Payments & Refunds": "payment",
    "Account & Profile": "account",
    Other: "other",
  };

  return ids[category] ?? category.toLowerCase();
}

function toApiCategory(category: string): SupportApiCategory {
  const ids: Record<string, SupportApiCategory> = {
    booking: "booking",
    flight: "flight",
    "check-in": "check_in",
    baggage: "baggage",
    payment: "payment",
    refund: "refund",
    technical: "technical",
    other: "other",
    "account & profile": "other",
    "booking & reservations": "booking",
    "flights & travel": "flight",
    "check-in & boarding": "check_in",
    "payments & refunds": "payment",
  };

  return ids[category.trim().toLowerCase()] ?? "other";
}

function mapApiTicket(ticket: ApiSupportTicket): UiSupportTicket {
  return {
    id: ticket.ticketNumber || ticket.id,
    category: getCategoryLabel(ticket.category),
    subject: ticket.subject,
    status:
      ticket.status === "resolved" || ticket.status === "closed"
        ? "resolved"
        : "open",
    priority:
      ticket.priority === "low"
        ? "low"
        : ticket.priority === "normal"
          ? "normal"
          : "high",
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    bookingReference: "",
    message: ticket.description,
  };
}

function createLocalMessage(
  ticketId: string,
  message: string,
  senderName: string,
): SupportMessage {
  return {
    id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ticketId,
    sender: "customer",
    senderName,
    message,
    createdAt: new Date().toISOString(),
  };
}

function createLocalTicket(
  submitted: SupportTicketSubmission,
): UiSupportTicket {
  const now = new Date().toISOString();
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();

  return {
    id: `SOG-DEMO-${Date.now().toString(36).toUpperCase()}-${randomPart}`,
    category: submitted.category,
    subject: submitted.subject.trim(),
    status: "open",
    priority: "normal",
    createdAt: now,
    updatedAt: now,
    bookingReference: submitted.bookingReference.trim(),
    message: submitted.message.trim(),
  };
}

export default function SupportFeature() {
  const { fetchCurrentUser } = useAuth();

  const {
    tickets: apiTickets,
    loading: supportLoading,
    getTicketsByUser,
    createTicket,
    addMessage,
    clearError,
  } = useSupport();

  const [tickets, setTickets] = useState<UiSupportTicket[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthUserSummary | null>(null);

  const [mode, setMode] = useState<SupportMode>("loading");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSupport(): Promise<void> {
      setMode("loading");

      try {
        const currentUser = await fetchCurrentUser();

        if (cancelled) return;

        setAuthenticatedUser(currentUser);

        try {
          const accountTickets = await getTicketsByUser();

          if (cancelled) return;

          setTickets(accountTickets.map(mapApiTicket));

          /*
           * The existing service has no message-history endpoint.
           * Display each ticket description as its initial customer
           * message until actual conversation history is available.
           */
          setMessages(
            accountTickets.map((ticket) => {
              const uiTicket = mapApiTicket(ticket);

              return {
                id: `MSG-${ticket.id}-initial`,
                ticketId: uiTicket.id,
                sender: "customer" as const,
                senderName: currentUser.firstName || "You",
                message: ticket.description,
                createdAt: ticket.createdAt,
              };
            }),
          );

          setSelectedTicketId(null);
          setMode("api");
          setNotice("");
          setActionError("");
        } catch (error) {
          if (cancelled) return;

          setTickets([]);
          setMessages([]);
          setMode("api");
          setActionError(
            error instanceof Error
              ? `Your support cases could not be loaded: ${error.message}`
              : "Your support cases could not be loaded. Please try again.",
          );

          setNotice(
            "The live support service is unavailable. No sample tickets are being presented as account records.",
          );
        }
      } catch {
        if (cancelled) return;

        const demoData = getSupportDemoData();

        setAuthenticatedUser(null);
        setTickets(demoData.tickets);
        setMessages(demoData.messages);
        setMode("demo");
        clearError();

        setNotice(
          "Live support is unavailable. You're viewing sample tickets and conversations. Demo changes are not sent to the support team.",
        );
      }
    }

    void loadSupport();

    return () => {
      cancelled = true;
    };
  }, [fetchCurrentUser, getTicketsByUser, clearError]);

  const searchTerm = searchQuery.trim().toLowerCase();

  const filteredTickets = useMemo(
    () =>
      tickets.filter((ticket) => {
        const matchesCategory =
          selectedCategory === "all" ||
          getCategoryId(ticket.category) === selectedCategory;

        const matchesSearch =
          !searchTerm ||
          [
            ticket.id,
            ticket.category,
            ticket.subject,
            ticket.message,
            ticket.bookingReference,
          ].some((value) => value.toLowerCase().includes(searchTerm));

        return matchesCategory && matchesSearch;
      }),
    [tickets, selectedCategory, searchTerm],
  );

  const matchingTopics = useMemo(
    () =>
      supportTopics.filter((topic) => {
        const matchesCategory =
          selectedCategory === "all" ||
          topic.category === selectedCategory;

        const matchesSearch =
          !searchTerm ||
          topic.title.toLowerCase().includes(searchTerm) ||
          topic.description.toLowerCase().includes(searchTerm) ||
          topic.category.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
      }),
    [selectedCategory, searchTerm],
  );

  const displayedTopics =
    searchTerm || selectedCategory !== "all"
      ? matchingTopics
      : matchingTopics.slice(0, 4);

  const selectedTicket = useMemo(
    () =>
      tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId],
  );

  const selectedMessages = useMemo(
    () =>
      selectedTicket
        ? messages.filter(
            (message) => message.ticketId === selectedTicket.id,
          )
        : [],
    [messages, selectedTicket],
  );

  const findApiTicket = (
    displayId: string,
  ): ApiSupportTicket | undefined =>
    apiTickets.find(
      (ticket) =>
        ticket.ticketNumber === displayId || ticket.id === displayId,
    );

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTicketId(null);
    setActionError("");
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActionError("");
    setNotice("");
  };

  const handleCreateTicket = async (
    submitted: SupportTicketSubmission,
  ): Promise<SupportTicketSubmissionResult> => {
    setIsCreatingTicket(true);
    setActionError("");
    setNotice("");

    try {
      if (mode === "demo") {
        const localTicket = createLocalTicket(submitted);

        setTickets((current) => [localTicket, ...current]);

        setMessages((current) => [
          ...current,
          {
            id: `MSG-${localTicket.id}-initial`,
            ticketId: localTicket.id,
            sender: "customer",
            senderName: "You",
            message: localTicket.message,
            createdAt: localTicket.createdAt,
          },
        ]);

        setSelectedCategory("all");
        setSelectedTicketId(localTicket.id);

        setNotice(
          "Your sample support request was created in this session only. It has not been delivered to SOG Airways Support.",
        );

        return {
          id: localTicket.id,
          isDemo: true,
        };
      }

      if (!authenticatedUser) {
        throw new Error("Sign in is required to create a support case.");
      }

      /*
       * The API ticket model has no separate bookingReference field,
       * so include the supplied reference in the message.
       */
      const apiMessage = [
        submitted.message.trim(),
        submitted.bookingReference.trim()
          ? `Booking reference: ${submitted.bookingReference.trim()}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const created = await createTicket({
        customerName: [
          authenticatedUser.firstName,
          authenticatedUser.lastName,
        ]
          .filter(Boolean)
          .join(" "),
        customerEmail: authenticatedUser.email,
        subject: submitted.subject.trim(),
        category: toApiCategory(submitted.category),
        priority: "medium",
        description: apiMessage,
      });

      const createdUiTicket: UiSupportTicket = {
        ...mapApiTicket(created),
        category: submitted.category,
        message: submitted.message.trim(),
        bookingReference: submitted.bookingReference.trim(),
      };

      setTickets((current) => [
        createdUiTicket,
        ...current.filter((ticket) => ticket.id !== createdUiTicket.id),
      ]);

      setMessages((current) => [
        ...current,
        {
          id: `MSG-${created.id}-initial`,
          ticketId: createdUiTicket.id,
          sender: "customer",
          senderName: authenticatedUser.firstName || "You",
          message: submitted.message.trim(),
          createdAt: created.createdAt,
        },
      ]);

      setSelectedCategory("all");
      setSelectedTicketId(createdUiTicket.id);

      setNotice(
        "Your support ticket was created through the Support API. The booking reference was included in the message because the current API has no separate booking-reference field.",
      );

      return {
        id: createdUiTicket.id,
        isDemo: false,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? `Your support request could not be submitted: ${error.message}`
          : "Your support request could not be submitted. Please try again.";

      setActionError(message);
      throw new Error(message);
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleSendMessage = async (message: string): Promise<void> => {
    if (!selectedTicket || selectedTicket.status === "resolved") {
      return;
    }

    setIsSendingMessage(true);
    setActionError("");
    setNotice("");

    try {
      if (mode === "demo") {
        setMessages((current) => [
          ...current,
          createLocalMessage(selectedTicket.id, message, "You"),
        ]);

        setNotice(
          "Your reply was added to the demo conversation for this session only. It has not been sent to the support team.",
        );

        return;
      }

      if (!authenticatedUser) {
        throw new Error("Sign in is required to reply to a support case.");
      }

      const apiTicket = findApiTicket(selectedTicket.id);

      if (!apiTicket) {
        throw new Error(
          "The matching API ticket could not be found. Reload your tickets and try again.",
        );
      }

      await addMessage({
        ticketId: apiTicket.id,
        message,
      });

      setMessages((current) => [
        ...current,
        createLocalMessage(
          selectedTicket.id,
          message,
          authenticatedUser.firstName || "You",
        ),
      ]);

      setNotice(
        "Your reply was sent through the Support API. Older support-agent messages aren't available because the current service doesn't expose a message-history endpoint.",
      );
    } catch (error) {
      const messageText =
        error instanceof Error
          ? `Your reply could not be sent: ${error.message}`
          : "Your reply could not be sent. Please try again.";

      setActionError(messageText);

      // Keep the message in the composer when sending fails.
      throw new Error(messageText);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const resultCount = searchTerm
    ? filteredTickets.length + matchingTopics.length
    : filteredTickets.length;

  return (
    <div className="space-y-6">
      <SupportHeader isSubmitting={isCreatingTicket} />

      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            mode === "demo"
              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300"
              : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-300"
          }`}
        >
          {mode === "demo" ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          )}

          <p>{notice}</p>
        </motion.div>
      )}

      {actionError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{actionError}</p>
        </motion.div>
      )}

      {mode === "loading" && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading your support account...
        </div>
      )}

      <SupportSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search tickets, help topics, or questions..."
        label="Search Support"
        resultCount={resultCount}
        resultLabel="results"
      />

      <SupportCategorySelector
        selectedCategory={selectedCategory}
        onChange={handleCategoryChange}
      />

      {displayedTopics.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {searchTerm
                  ? "Matching Help Topics"
                  : "Helpful Support Topics"}
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Browse quick guidance before creating a ticket.
              </p>
            </div>

            <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
              {displayedTopics.length}{" "}
              {displayedTopics.length === 1 ? "topic" : "topics"}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {displayedTopics.map((topic, index) => (
              <motion.article
                key={topic.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(index * 0.04, 0.2),
                }}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  {getCategoryLabel(topic.category)}
                </p>

                <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {topic.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {topic.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          {selectedTicket ? (
            <TicketDetails
              ticket={selectedTicket}
              messages={selectedMessages}
              isSending={isSendingMessage}
              onBack={() => setSelectedTicketId(null)}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <SupportTicketList
              tickets={filteredTickets}
              selectedTicketId={selectedTicketId}
              onSelectTicket={handleSelectTicket}
            />
          )}
        </div>

        <div className="min-w-0">
          <SupportTicketForm onSubmit={handleCreateTicket} />
        </div>
      </div>

      <SupportContactOptions />

      {mode === "api" && supportLoading && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Synchronizing support data...
        </p>
      )}
    </div>
  );
}
