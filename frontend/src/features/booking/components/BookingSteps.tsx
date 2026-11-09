import { motion } from "framer-motion";
import {
  Check,
  CreditCard,
  Luggage,
  Plane,
  Users,
} from "lucide-react";

interface BookingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface BookingStepsProps {
  currentStep: number;
  onStepChange?: (step: number) => void;
}

const BOOKING_STEPS: BookingStep[] = [
  {
    id: "flight",
    title: "Flight",
    description: "Choose your flight",
    icon: Plane,
  },
  {
    id: "passengers",
    title: "Passengers",
    description: "Passenger details",
    icon: Users,
  },
  {
    id: "baggage",
    title: "Baggage",
    description: "Select baggage",
    icon: Luggage,
  },
  {
    id: "payment",
    title: "Payment",
    description: "Complete payment",
    icon: CreditCard,
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "Booking complete",
    icon: Check,
  },
];

export default function BookingSteps({
  currentStep,
  onStepChange,
}: BookingStepsProps) {
  const handleStepClick = (step: number) => {
    if (step >= currentStep) {
      return;
    }

    onStepChange?.(step);
  };

  return (
    <nav
      aria-label="Booking progress"
      className="w-full"
    >
      <div className="hidden overflow-x-auto lg:block">
        <div className="flex min-w-190 items-start">
          {BOOKING_STEPS.map(
            (step, index) => {
              const stepNumber = index + 1;

              const isCompleted =
                stepNumber < currentStep;

              const isCurrent =
                stepNumber === currentStep;

              const isUpcoming =
                stepNumber > currentStep;

              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className="flex flex-1 items-start"
                >
                  <div className="flex flex-1 flex-col items-center">
                    <button
                      type="button"
                      onClick={() =>
                        handleStepClick(
                          stepNumber,
                        )
                      }
                      disabled={
                        isUpcoming ||
                        isCurrent
                      }
                      className={`group flex flex-col items-center ${
                        isCompleted
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isCurrent
                            ? 1.05
                            : 1,
                        }}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                          isCompleted
                            ? "border-sky-600 bg-sky-600 text-white"
                            : isCurrent
                              ? "border-sky-600 bg-white text-sky-600 shadow-md shadow-sky-500/20 dark:bg-slate-950 dark:text-sky-400"
                              : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </motion.div>

                      <span
                        className={`mt-3 text-sm font-semibold ${
                          isCompleted ||
                          isCurrent
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {step.title}
                      </span>

                      <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {step.description}
                      </span>
                    </button>
                  </div>

                  {index <
                    BOOKING_STEPS.length -
                      1 && (
                    <div className="mt-5 h-0.5 flex-1 bg-slate-200 dark:bg-slate-800">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width:
                            isCompleted
                              ? "100%"
                              : "0%",
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                        className="h-full bg-sky-600"
                      />
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Mobile and Tablet */}
      <div className="lg:hidden">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {(() => {
                const step =
                  BOOKING_STEPS[
                    Math.min(
                      currentStep - 1,
                      BOOKING_STEPS.length -
                        1,
                    )
                  ];

                const Icon = step.icon;

                return (
                  <>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white dark:bg-sky-500">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Step {currentStep} of{" "}
                        {BOOKING_STEPS.length}
                      </p>

                      <h2 className="font-semibold text-slate-900 dark:text-white">
                        {step.title}
                      </h2>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-sky-600 dark:text-sky-400">
                {Math.round(
                  (currentStep /
                    BOOKING_STEPS.length) *
                    100,
                )}
                %
              </p>

              <p className="text-xs text-slate-400">
                Complete
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${
                  (currentStep /
                    BOOKING_STEPS.length) *
                  100
                }%`,
              }}
              transition={{
                duration: 0.4,
              }}
              className="h-full rounded-full bg-sky-600 dark:bg-sky-500"
            />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {BOOKING_STEPS.map(
              (step, index) => {
                const stepNumber = index + 1;

                const isCompleted =
                  stepNumber < currentStep;

                const isCurrent =
                  stepNumber === currentStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={
                      !isCompleted
                    }
                    onClick={() =>
                      handleStepClick(
                        stepNumber,
                      )
                    }
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      isCurrent
                        ? "bg-sky-600 text-white dark:bg-sky-500"
                        : isCompleted
                          ? "bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                    }`}
                  >
                    {stepNumber}.{" "}
                    {step.title}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}