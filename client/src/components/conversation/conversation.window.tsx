import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Socket } from "socket.io-client";
import { LuArrowDown, LuMessageSquare } from "react-icons/lu";
import { ConversationWindowProps } from "@/types/props/conversation.props";
import {
  ConversationResponseType,
  MessageResponseDataType,
  MessagesResponseType,
} from "@/types/types/response.types";
import {
  MessageDisplayType,
  MessageDeliveryStatusType,
  MessageResponseType,
} from "@/types/types/message.types";
import { UserProfileType } from "@/types/types/profile.types";
import { ConversationDisplayType } from "@/types/types/conversation.types";
import { useAppStore } from "@/store/store";
import { createSocketConnection } from "@/socket/socket";
import { getFullName } from "@/helpers/profile.helpers";
import { getConversationDisplay } from "@/utils/conversation.utils";
import { getMessageDisplay } from "@/utils/message.utils";
import {
  fetchConversationMessages,
  markConversationAsRead,
  markMessageDelivered,
  markMessageSeen,
  sendConversationMessage,
} from "@/lib/actions/conversation.action";
import ConversationFooter from "@/components/conversation/conversation.footer";
import MessagesContainer from "@/components/conversation/messages.container";
import ConversationHeader from "@/components/conversation/conversation.header";

const ConversationWindow = ({
  conversation,
  onBack,
}: ConversationWindowProps) => {
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [conversationDisplay, setConversationDisplay] =
    useState<ConversationDisplayType | null>(null);
  const [draft, setDraft] = useState("");
  const [displayMessages, setDisplayMessages] = useState<MessageDisplayType[]>(
    [],
  );
  const [messages, setMessages] = useState<MessageResponseType[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const conversationRef = useRef<ConversationResponseType | null>(null);
  const activeConversationIdRef = useRef<string | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const previousMessagesLengthRef = useRef(0);
  const seenMessageIdsRef = useRef(new Set<string>());

  const loggedInUser = useAppStore((state) => state.loggedInUser);
  const loggedInUserRef = useRef(loggedInUser);
  const accessToken = useAppStore((state) => state.accessToken);
  const updateConversationWithMessage = useAppStore(
    (state) => state.updateConversationWithMessage,
  );
  const resetConversationUnread = useAppStore(
    (state) => state.resetConversationUnread,
  );

  const getMessageSenderId = (message: MessageResponseType) =>
    typeof message.sender === "string" ? message.sender : message.sender.userId;

  const getMessageId = (message: MessageResponseType) =>
    message.messageId ?? message.id;

  const upsertMessage = (message: MessageResponseType) => {
    const incomingId = getMessageId(message);

    setMessages((currentMessages) => {
      if (
        activeConversationIdRef.current &&
        message.conversation !== activeConversationIdRef.current
      ) {
        return currentMessages;
      }

      const matchedIndex = currentMessages.findIndex((currentMessage) => {
        const currentId = getMessageId(currentMessage);

        return (
          (incomingId && currentId === incomingId) ||
          (message.clientMessageId &&
            currentMessage.clientMessageId === message.clientMessageId)
        );
      });

      if (matchedIndex === -1) return [...currentMessages, message];

      return currentMessages.map((currentMessage, index) =>
        index === matchedIndex ? message : currentMessage,
      );
    });
  };

  const updateMessageDeliveryStatus = (
    messageId: string,
    status: Exclude<MessageDeliveryStatusType, "sending" | "failed">,
    userId: string,
  ) => {
    const now = new Date().toISOString();

    setMessages((currentMessages) =>
      currentMessages.map((message) => {
        const currentId = getMessageId(message);

        if (currentId !== messageId) return message;

        const receipts = message.receipts ?? [];
        const matchedReceipt = receipts.find(
          (receipt) => receipt.user === userId,
        );
        const nextReceipt = {
          user: userId,
          deliveredAt:
            matchedReceipt?.deliveredAt ??
            (status === "delivered" || status === "seen" ? now : null),
          seenAt: matchedReceipt?.seenAt ?? (status === "seen" ? now : null),
        };

        return {
          ...message,
          deliveryStatus:
            status === "seen" || message.deliveryStatus !== "seen"
              ? status
              : message.deliveryStatus,
          receipts: matchedReceipt
            ? receipts.map((receipt) =>
                receipt.user === userId ? nextReceipt : receipt,
              )
            : [...receipts, nextReceipt],
        };
      }),
    );
  };

  const emitMessageReceipt = (
    message: MessageResponseType,
    status: "delivered" | "seen",
  ) => {
    const socket = socketRef.current;
    const messageId = getMessageId(message);
    const senderId = getMessageSenderId(message);
    const activeConversation = conversationRef.current;

    if (!socket || !activeConversation?.id || !messageId || !senderId) return;
    if (senderId === loggedInUserRef.current?.userId) return;

    void (status === "seen"
      ? markMessageSeen(activeConversation.id, messageId)
      : markMessageDelivered(activeConversation.id, messageId));

    if (activeConversation.type === "direct") {
      socket.emit(status === "seen" ? "message-seen" : "message-delivered", {
        targetUserId: senderId,
        messageId,
      });
      return;
    }

    socket.emit(
      status === "seen" ? "group-message-seen" : "group-message-delivered",
      {
        conversationId: activeConversation.id,
        messageId,
      },
    );
  };

  const handleReceivedMessage = (message: MessageResponseType) => {
    if (message.conversation !== activeConversationIdRef.current) return;

    upsertMessage(message);
    updateConversationWithMessage(message, {
      activeConversationId: activeConversationIdRef.current,
    });
    emitMessageReceipt(message, "delivered");
    emitMessageReceipt(message, "seen");
  };

  const getConversationMessages = async (
    conversation: ConversationResponseType,
  ) => {
    setIsLoadingMessages(true);

    const fetchConversationMessagesResponse = await fetchConversationMessages(
      conversation.id,
    );

    if (
      fetchConversationMessagesResponse.success &&
      fetchConversationMessagesResponse.data
    ) {
      const data =
        fetchConversationMessagesResponse.data as MessagesResponseType;

      setMessages(data.messages);
    } else {
      setMessages([]);
    }

    setIsLoadingMessages(false);
  };

  const persistConversationReadState = async (conversationId: string) => {
    await markConversationAsRead(conversationId);
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);

    const maxHeight = lineHeight * 3;

    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    setDraft(el.value);
  };

  const resetHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
  };

  const emitMessage = (message: MessageResponseType) => {
    const socket = socketRef.current;
    if (!socket || !conversation) return;

    if (conversation.type === "direct" && targetUserId) {
      socket.emit("send-message", { targetUserId, message });
      return;
    }

    socket.emit("send-group-message", {
      conversationId: conversation.id,
      message,
    });
  };

  const createPendingMessage = (content: string): MessageResponseType => {
    const now = new Date().toISOString();
    const clientMessageId = `local-${crypto.randomUUID()}`;
    const sender = {
      userId: loggedInUser?.userId ?? "",
      status: loggedInUser?.status,
      email: loggedInUser?.email ?? "",
      emailVerified: true,
      phoneVerified: false,
      userName: loggedInUser?.userName ?? "",
      firstName: loggedInUser?.firstName,
      lastName: loggedInUser?.lastName,
      fullName: getFullName(loggedInUser),
      avatar: loggedInUser?.avatar,
      createdAt: now,
      updatedAt: now,
    } as UserProfileType;

    return {
      id: clientMessageId,
      messageId: clientMessageId,
      clientMessageId,
      conversation: conversation?.id ?? "",
      sender,
      contentType: "text",
      content,
      attachments: [],
      location: null,
      replyTo: null,
      forwardedFrom: null,
      receipts: [],
      reactions: [],
      deletedAt: null,
      editHistory: [],
      callData: null,
      createdAt: now,
      updatedAt: now,
      deliveryStatus: "sending",
    };
  };

  const persistAndEmitMessage = async (
    clientMessageId: string,
    content: string,
  ) => {
    if (!conversation?.id) return;

    setIsSending(true);
    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.clientMessageId === clientMessageId ||
        message.messageId === clientMessageId
          ? {
              ...message,
              deliveryStatus: "sending",
              errorMessage: undefined,
            }
          : message,
      ),
    );

    const response = await sendConversationMessage(conversation.id, content);

    if (response.success && response.data) {
      const data = response.data as MessageResponseDataType;
      if (data.message) {
        const savedMessage = {
          ...data.message,
          clientMessageId,
          deliveryStatus: "sent" as const,
        };

        updateConversationWithMessage(savedMessage, {
          activeConversationId: conversation.id,
          incrementUnread: false,
        });
        upsertMessage(savedMessage);
        emitMessage(savedMessage);
      }
    } else {
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.clientMessageId === clientMessageId ||
          message.messageId === clientMessageId
            ? {
                ...message,
                deliveryStatus: "failed",
                errorMessage: response.message ?? "Message could not be saved.",
              }
            : message,
        ),
      );
    }

    setIsSending(false);
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !conversation?.id || isSending) return;

    const pendingMessage = createPendingMessage(content);
    shouldAutoScrollRef.current = true;
    updateConversationWithMessage(pendingMessage, {
      activeConversationId: conversation.id,
      incrementUnread: false,
    });
    upsertMessage(pendingMessage);
    setDraft("");
    if (textareaRef.current) textareaRef.current.value = "";
    resetHeight();

    await persistAndEmitMessage(pendingMessage.clientMessageId ?? "", content);
  };

  const handleResend = async (messageId: string) => {
    if (isSending) return;

    const failedMessage = messages.find(
      (message) =>
        message.messageId === messageId ||
        message.clientMessageId === messageId,
    );

    if (!failedMessage) return;

    await persistAndEmitMessage(
      failedMessage.clientMessageId ?? failedMessage.messageId ?? messageId,
      failedMessage.content,
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMessagesContainerNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    return distanceFromBottom <= 64;
  };

  const scrollMessagesToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = messagesContainerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior });
    });
  };

  const handleMessagesScroll = () => {
    const isNearBottom = isMessagesContainerNearBottom();

    shouldAutoScrollRef.current = isNearBottom;

    if (isNearBottom) {
      setNewMessagesCount(0);
    }
  };

  const handleNewMessagesClick = () => {
    shouldAutoScrollRef.current = true;
    setNewMessagesCount(0);
    scrollMessagesToBottom();
  };

  useEffect(() => {
    conversationRef.current = conversation;
    loggedInUserRef.current = loggedInUser;
    activeConversationIdRef.current = conversation?.id ?? null;
    shouldAutoScrollRef.current = true;
    previousMessagesLengthRef.current = 0;
    seenMessageIdsRef.current = new Set();
    setNewMessagesCount(0);
    if (conversation?.id) {
      resetConversationUnread(conversation.id);
      void persistConversationReadState(conversation.id);
    }

    setTargetUserId(
      conversation?.participants.find(
        (participant) => participant.user.userId !== loggedInUser?.userId,
      )?.user.userId ?? null,
    );

    setConversationDisplay(
      conversation ? getConversationDisplay(conversation, loggedInUser) : null,
    );

    if (conversation) {
      getConversationMessages(conversation);
    }
  }, [conversation, loggedInUser]);

  useEffect(() => {
    setDisplayMessages(
      messages.map((message) => getMessageDisplay(message, loggedInUser)),
    );
  }, [messages, loggedInUser]);

  useEffect(() => {
    if (!conversation?.id || !socketRef.current) return;

    messages.forEach((message) => {
      const messageId = getMessageId(message);
      const senderId = getMessageSenderId(message);

      if (!messageId || senderId === loggedInUser?.userId) return;
      if (seenMessageIdsRef.current.has(messageId)) return;

      seenMessageIdsRef.current.add(messageId);
      emitMessageReceipt(message, "seen");
    });
  }, [conversation?.id, loggedInUser?.userId, messages]);

  useEffect(() => {
    if (!conversation?.id || !shouldAutoScrollRef.current) return;

    scrollMessagesToBottom(isLoadingMessages ? "auto" : "smooth");
  }, [conversation?.id, displayMessages.length, isLoadingMessages]);

  useEffect(() => {
    const previousMessagesLength = previousMessagesLengthRef.current;
    const nextMessagesLength = displayMessages.length;
    const newMessagesLength = nextMessagesLength - previousMessagesLength;

    previousMessagesLengthRef.current = nextMessagesLength;

    if (!conversation?.id || newMessagesLength <= 0) return;

    if (shouldAutoScrollRef.current) {
      setNewMessagesCount(0);
      return;
    }

    setNewMessagesCount((count) => count + newMessagesLength);
  }, [conversation?.id, displayMessages.length]);

  useEffect(() => {
    if (!accessToken) return;

    const socket = createSocketConnection({ token: accessToken });
    socketRef.current = socket;

    socket.on("received-message", handleReceivedMessage);
    socket.on("received-group-message", handleReceivedMessage);
    socket.on("message-delivered", ({ messageId, deliveredTo }) => {
      updateMessageDeliveryStatus(messageId, "delivered", deliveredTo);
    });
    socket.on("group-message-delivered", ({ messageId, deliveredTo }) => {
      updateMessageDeliveryStatus(messageId, "delivered", deliveredTo);
    });
    socket.on("message-seen", ({ messageId, seenBy }) => {
      updateMessageDeliveryStatus(messageId, "seen", seenBy);
    });
    socket.on("group-message-seen", ({ messageId, seenBy }) => {
      updateMessageDeliveryStatus(messageId, "seen", seenBy);
    });

    return () => {
      socket.off("received-message", handleReceivedMessage);
      socket.off("received-group-message", handleReceivedMessage);
      socket.off("message-delivered");
      socket.off("group-message-delivered");
      socket.off("message-seen");
      socket.off("group-message-seen");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversation?.id) return;

    if (conversation.type === "direct" && targetUserId) {
      socket.emit("join-chat", { targetUserId });
      return;
    }

    socket.emit("join-group-chat", {
      conversationId: conversation.id,
    });

    return () => {
      socket.emit("leave-group-chat", {
        conversationId: conversation.id,
      });
    };
  }, [accessToken, conversation?.id, conversation?.type, targetUserId]);

  if (!conversation) {
    return (
      <div className="hidden relative md:flex flex-col flex-1 justify-center items-center gap-2">
        <div className="flex justify-center items-center mb-4 rounded-full w-16 h-16 text-text-secondary glass">
          <LuMessageSquare size={32} />
        </div>
        <h3>Your Messages</h3>
        <p className="text-text-secondary">
          Select a chat to start messaging...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col flex-1 w-full h-full">
      <ConversationHeader
        onBack={onBack}
        conversationDisplay={conversationDisplay}
      />

      <MessagesContainer
        messagesContainerRef={messagesContainerRef}
        handleMessagesScroll={handleMessagesScroll}
        isLoadingMessages={isLoadingMessages}
        displayMessages={displayMessages}
        handleResend={handleResend}
      />

      {newMessagesCount > 0 && (
        <button
          onClick={handleNewMessagesClick}
          className="right-4 bottom-24 md:bottom-20 z-(--z-raised) absolute flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-text-primary glass shadow-glass"
        >
          <LuArrowDown size={16} />
          {newMessagesCount} new{" "}
          {newMessagesCount === 1 ? "message" : "messages"}
        </button>
      )}

      <ConversationFooter
        textareaRef={textareaRef}
        handleInput={handleInput}
        handleKeyDown={handleKeyDown}
        isSending={isSending}
        handleSend={handleSend}
        draft={draft}
      />
    </div>
  );
};

export default ConversationWindow;
