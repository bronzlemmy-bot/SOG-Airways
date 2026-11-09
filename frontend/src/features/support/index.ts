
export { default as SupportFeature } from "./SupportFeature";

// Support components — alphabetical order
export { default as MessageComposer } from "./components/SupportMessageComposer";
export { default as MessageList } from "./components/SupportMessageList";
export { default as SupportCategorySelector } from "./components/SupportCategorySelector";
export { default as SupportConfirmation } from "./components/SupportConfirmation";
export { default as SupportContactOptions } from "./components/SupportContactOptions";
export { default as SupportForm } from "./components/SupportForm";
export { default as SupportHeader } from "./components/SupportHeader";
export { default as SupportSearch } from "./components/SupportSearch";
export { default as SupportTicketCard } from "./components/SupportTicketCard";
export { default as SupportTicketForm } from "./components/SupportTicketForm";
export { default as SupportTicketList } from "./components/SupportTicketList";
export { default as TicketDetails } from "./components/SupportTicketDetails";

// Support form types
export type {
  SupportFormSubmission,
  SupportSubmissionResult,
} from "./components/SupportForm";

export type {
  SupportTicketSubmission,
  SupportTicketSubmissionResult,
} from "./components/SupportTicketForm";

// Demo data
export {
  getSupportDemoData,
  supportDemoData,
} from "./data/supportDemoData";

export type {
  SupportDemoData,
} from "./data/supportDemoData";
