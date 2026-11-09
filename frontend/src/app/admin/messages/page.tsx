"use client";

import { useMemo, useState } from "react";

import MessageComposer from "@/components/admin/messages/MessageComposer";
import MessageConversation from "@/components/admin/messages/MessageConversation";
import MessageHeader from "@/components/admin/messages/MessageHeader";
import MessageList from "@/components/admin/messages/MessageList";

import {
adminMessageConversationsData,
adminMessagesData,
adminMessageSummaries,
} from "@/components/admin/messages/admin-messages-data/AdminMessagesData";

import type {
AdminConversationMessage,
AdminMessage,
AdminMessageConversation,
AdminMessageStatus,
} from "@/components/admin/messages/admin-messages-data/AdminMessagesData";

export default function MessagesPage() {
const [messages, setMessages] =
useState<AdminMessage[]>(
adminMessagesData,
);

const [conversations, setConversations] =
useState<AdminMessageConversation[]>(
adminMessageConversationsData,
);

const [searchQuery, setSearchQuery] =
useState("");

const [statusFilter, setStatusFilter] =
useState<AdminMessageStatus | "all">(
"all",
);

const [selectedMessageId, setSelectedMessageId] =
useState<string | null>(
adminMessagesData[0]?.id ?? null,
);

const [isComposerOpen, setIsComposerOpen] =
useState(false);

const selectedMessage = useMemo(() => {
if (!selectedMessageId) {
return null;
}


return (
  messages.find(
    (message) =>
      message.id === selectedMessageId,
  ) ?? null
);


}, [messages, selectedMessageId]);

const selectedConversation = useMemo(() => {
if (!selectedMessage) {
return null;
}


return (
  conversations.find(
    (conversation) =>
      conversation.id ===
      selectedMessage.conversationId,
  ) ?? null
);


}, [conversations, selectedMessage]);

const filteredMessages = useMemo(() => {
const query = searchQuery
.trim()
.toLowerCase();


return messages.filter((message) => {
  const matchesStatus =
    statusFilter === "all" ||
    message.status === statusFilter;

  if (!matchesStatus) {
    return false;
  }

  if (!query) {
    return true;
  }

  return [
    message.senderName,
    message.senderEmail,
    message.subject,
    message.message,
    message.bookingReference,
    message.flightNumber,
    message.type,
    message.priority,
  ]
    .filter(Boolean)
    .some((value) =>
      String(value)
        .toLowerCase()
        .includes(query),
    );
});


}, [
messages,
searchQuery,
statusFilter,
]);

const handleSelectMessage = (
message: AdminMessage,
) => {
setSelectedMessageId(message.id);
setIsComposerOpen(false);


if (message.status === "unread") {
  setMessages((current) =>
    current.map((item) =>
      item.id === message.id
        ? {
            ...item,
            status: "read",
            updatedAt: new Date().toISOString(),
          }
        : item,
    ),
  );

  setConversations((current) =>
    current.map((conversation) =>
      conversation.id ===
      message.conversationId
        ? {
            ...conversation,
            status: "read",
            updatedAt:
              new Date().toISOString(),
            messages:
              conversation.messages.map(
                (conversationMessage) => ({
                  ...conversationMessage,
                  read: true,
                }),
              ),
          }
        : conversation,
    ),
  );
}


};

const handleMarkAsRead = () => {
if (
!selectedMessage ||
!selectedConversation
) {
return;
}


const now = new Date().toISOString();

setMessages((current) =>
  current.map((message) =>
    message.id === selectedMessage.id
      ? {
          ...message,
          status: "read",
          updatedAt: now,
        }
      : message,
  ),
);

setConversations((current) =>
  current.map((conversation) =>
    conversation.id ===
    selectedConversation.id
      ? {
          ...conversation,
          status: "read",
          updatedAt: now,
          messages:
            conversation.messages.map(
              (message) => ({
                ...message,
                read: true,
              }),
            ),
        }
      : conversation,
  ),
);


};

const handleArchive = () => {
if (
!selectedMessage ||
!selectedConversation
) {
return;
}


const now = new Date().toISOString();

setMessages((current) =>
  current.map((message) =>
    message.id === selectedMessage.id
      ? {
          ...message,
          status: "archived",
          updatedAt: now,
        }
      : message,
  ),
);

setConversations((current) =>
  current.map((conversation) =>
    conversation.id ===
    selectedConversation.id
      ? {
          ...conversation,
          status: "archived",
          updatedAt: now,
        }
      : conversation,
  ),
);


};

const handleSendMessage = (
messageText: string,
) => {
if (
!selectedMessage ||
!selectedConversation
) {
return;
}


const now = new Date().toISOString();

const newConversationMessage: AdminConversationMessage =
  {
    id: `conversation-message-${Date.now()}`,
    conversationId:
      selectedConversation.id,
    senderId: "admin",
    senderName: "SOG Airways Admin",
    senderRole: "admin",
    message: messageText,
    createdAt: now,
    read: true,
  };

setConversations((current) =>
  current.map((conversation) =>
    conversation.id ===
    selectedConversation.id
      ? {
          ...conversation,
          status: "read",
          updatedAt: now,
          messages: [
            ...conversation.messages,
            newConversationMessage,
          ],
        }
      : conversation,
  ),
);

setMessages((current) =>
  current.map((message) =>
    message.id === selectedMessage.id
      ? {
          ...message,
          status: "read",
          message: messageText,
          updatedAt: now,
        }
      : message,
  ),
);

setIsComposerOpen(false);


};

const handleNewMessage = () => {
setSelectedMessageId(null);
setIsComposerOpen(true);
};

const handleBack = () => {
setSelectedMessageId(null);
setIsComposerOpen(false);
};

const handleCancelComposer = () => {
setIsComposerOpen(false);


if (!selectedMessageId) {
  setSelectedMessageId(
    messages[0]?.id ?? null,
  );
}


};

const summaries = useMemo(() => {
return adminMessageSummaries.map(
(summary) => {
if (summary.type === "total") {
return {
...summary,
value: String(messages.length),
};
}


    if (summary.type === "unread") {
      return {
        ...summary,
        value: String(
          messages.filter(
            (message) =>
              message.status === "unread",
          ).length,
        ),
      };
    }

    if (summary.type === "read") {
      return {
        ...summary,
        value: String(
          messages.filter(
            (message) =>
              message.status === "read",
          ).length,
        ),
      };
    }

    if (summary.type === "urgent") {
      return {
        ...summary,
        value: String(
          messages.filter(
            (message) =>
              message.priority ===
                "urgent" &&
              message.status !==
                "archived",
          ).length,
        ),
      };
    }

    return summary;
  },
);


}, [messages]);

return ( <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8"> <div className="mx-auto max-w-7xl space-y-6"> <MessageHeader
       summaries={summaries}
       onCompose={handleNewMessage}
     />


    {isComposerOpen ? (
      <MessageComposer
        recipientName={
          selectedConversation?.customerName
        }
        recipientEmail={
          selectedConversation?.customerEmail
        }
        subject={
          selectedConversation?.subject
        }
        onSend={handleSendMessage}
        onCancel={handleCancelComposer}
      />
    ) : null}

    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <MessageList
        messages={filteredMessages}
        selectedMessageId={
          selectedMessageId
        }
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onSelectMessage={
          handleSelectMessage
        }
      />

      <MessageConversation
        conversation={selectedConversation}
        onBack={handleBack}
        onMarkAsRead={
          handleMarkAsRead
        }
        onArchive={handleArchive}
      />
    </div>
  </div>
</main>


);
}
