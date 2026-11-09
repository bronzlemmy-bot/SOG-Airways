"use client";

import { motion } from "framer-motion";

import TripAction, {
  type TripActionType,
} from "./TripAction";

export interface TripActionsProps {
  availableActions?: TripActionType[];
  disabledActions?: TripActionType[];
  loadingAction?: TripActionType | null;
  onChangeFlight: () => void;
  onChangePassenger: () => void;
  onChangeSeat: () => void;
  onManageBaggage: () => void;
  onCancelTrip: () => void;
  onViewTicket: () => void;
  onAction?: (action: TripActionType) => void;
  className?: string;
}

const ACTIONS: {
  action: TripActionType;
  handler: keyof Pick<
    TripActionsProps,
    | "onChangeFlight"
    | "onChangePassenger"
    | "onChangeSeat"
    | "onManageBaggage"
    | "onCancelTrip"
    | "onViewTicket"
  >;
}[] = [
  { action: "change-flight", handler: "onChangeFlight" },
  { action: "change-passenger", handler: "onChangePassenger" },
  { action: "change-seat", handler: "onChangeSeat" },
  { action: "manage-baggage", handler: "onManageBaggage" },
  { action: "view-ticket", handler: "onViewTicket" },
  { action: "cancel-trip", handler: "onCancelTrip" },
];

export default function TripActions({
  availableActions = [
    "change-flight",
    "change-passenger",
    "change-seat",
    "manage-baggage",
    "view-ticket",
    "cancel-trip",
  ],
  disabledActions = [],
  loadingAction = null,
  onChangeFlight,
  onChangePassenger,
  onChangeSeat,
  onManageBaggage,
  onCancelTrip,
  onViewTicket,
  onAction,
  className = "",
}: TripActionsProps) {
  const handlers = {
    onChangeFlight,
    onChangePassenger,
    onChangeSeat,
    onManageBaggage,
    onCancelTrip,
    onViewTicket,
  };

  const visibleActions = ACTIONS.filter(({ action }) =>
    availableActions.includes(action),
  );

  return (
    <section
      aria-labelledby="trip-actions-heading"
      className={className}
    >
      <div className="mb-5">
        <h2
          id="trip-actions-heading"
          className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl"
        >
          Manage your trip
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choose an option below to manage your SOG Airways booking.
        </p>
      </div>

      {visibleActions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No trip actions are currently available.
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06 },
            },
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {visibleActions.map(({ action, handler }) => (
            <motion.div
              key={action}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.25 }}
            >
              <TripAction
                action={action}
                disabled={disabledActions.includes(action)}
                loading={loadingAction === action}
                variant={
                  action === "change-flight" ? "primary" : "outline"
                }
                onClick={() => {
                  handlers[handler]();
                  onAction?.(action);
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
