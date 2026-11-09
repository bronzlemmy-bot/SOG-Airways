export { default as BoardingPass } from "./BoardingPass";
export { default as CheckInConfirmation } from "./CheckInConfirmation";
export { default as CheckInForm } from "./CheckInForm";
export { default as CheckInHeader } from "./CheckInHeader";
export { default as CheckInSummary } from "./CheckInSummary";
export { default as PassengerVerification } from "./PassengerVerification";
export { default as SeatSelection } from "./SeatSelection";

export type {
  PassengerVerificationData,
  PassengerDocumentType,
} from "./PassengerVerification";

export type { Seat, SeatStatus } from "./SeatSelection";