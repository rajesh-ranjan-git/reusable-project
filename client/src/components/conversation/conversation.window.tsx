import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Socket } from "socket.io-client";
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
import { useAppStore } from "@/store/store";
import { createSocketConnection } from "@/socket/socket";
import { getConversationDisplay } from "@/helpers/conversation.helpers";
import { getMessageDisplay } from "@/helpers/message.helpers";
import {
  fetchConversationMessages,
  markConversationAsRead,
  markMessageDelivered,
  markMessageSeen,
  sendConversationMessage,
} from "@/lib/actions/conversation.action";
import EmptyConversation from "@/components/conversation/empty.conversation";
import NewMessagesButton from "@/components/conversation/new.messages.button";
import ConversationFooter from "@/components/conversation/conversation.footer";
import MessagesContainer from "@/components/conversation/messages.container";
import ConversationHeader from "@/components/conversation/conversation.header";

const ConversationWindow = ({
  conversation,
  onBack,
}: ConversationWindowProps) => {
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [displayMessages, setDisplayMessages] = useState<MessageDisplayType[]>(
    [],
  );
  const [messages, setMessages] = useState<MessageResponseType[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [nextMessagesCursor, setNextMessagesCursor] = useState<string | null>(
    null,
  );
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
  const isFetchingOlderMessagesRef = useRef(false);
  const suppressNextMessageCountRef = useRef(false);
  const hasInitialScrolledRef = useRef(false);
  const isLoadingOlderMessagesRef = useRef(false);
  const olderMessagesScrollSnapshotRef = useRef<{
    scrollHeight: number;
    scrollTop: number;
  } | null>(null);

  const loggedInUser = useAppStore((state) => state.loggedInUser);
  const loggedInUserRef = useRef(loggedInUser);
  const accessToken = useAppStore((state) => state.accessToken);
  const onlineUserIds = useAppStore((state) => state.onlineUserIds);
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

  const conversationDisplay = useMemo(
    () =>
      conversation
        ? getConversationDisplay(conversation, loggedInUser, onlineUserIds)
        : null,
    [conversation, loggedInUser, onlineUserIds],
  );

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
    cursor?: string | null,
  ) => {
    const isLoadingOlder = !!cursor;
    const container = messagesContainerRef.current;

    if (isLoadingOlder) {
      if (isFetchingOlderMessagesRef.current) return;
      isFetchingOlderMessagesRef.current = true;
      isLoadingOlderMessagesRef.current = true;
      olderMessagesScrollSnapshotRef.current = container
        ? {
            scrollHeight: container.scrollHeight,
            scrollTop: container.scrollTop,
          }
        : null;
      setIsLoadingOlderMessages(true);
    } else {
      setIsLoadingMessages(true);
    }

    const fetchConversationMessagesResponse = await fetchConversationMessages(
      conversation.id,
      cursor,
    );

    if (
      fetchConversationMessagesResponse.success &&
      fetchConversationMessagesResponse.data
    ) {
      const data =
        fetchConversationMessagesResponse.data as MessagesResponseType;

      setNextMessagesCursor(data.nextCursor);
      setMessages((prev) => {
        if (!isLoadingOlder) return data.messages;

        const existingIds = new Set(
          prev.map((message) => getMessageId(message)).filter(Boolean),
        );
        const olderMessages = data.messages.filter((message) => {
          const messageId = getMessageId(message);
          return !messageId || !existingIds.has(messageId);
        });

        if (olderMessages.length === 0) {
          olderMessagesScrollSnapshotRef.current = null;
          return prev;
        }

        return [...olderMessages, ...prev];
      });

      if (isLoadingOlder) {
        suppressNextMessageCountRef.current = true;
      }
    } else {
      if (!isLoadingOlder) setMessages([]);
      olderMessagesScrollSnapshotRef.current = null;
    }

    if (isLoadingOlder) {
      setIsLoadingOlderMessages(false);
      isLoadingOlderMessagesRef.current = false;
      isFetchingOlderMessagesRef.current = false;
    } else {
      setIsLoadingMessages(false);
    }
  };

  const loadOlderMessages = () => {
    if (
      !conversation ||
      !nextMessagesCursor ||
      isLoadingOlderMessagesRef.current
    )
      return;

    getConversationMessages(conversation, nextMessagesCursor);
  };

  const persistConversationReadState = async (conversationId: string) => {
    await markConversationAsRead(conversationId);
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

  const scrollMessagesToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = messagesContainerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior });
    });
  };

  useEffect(() => {
    conversationRef.current = conversation;
    loggedInUserRef.current = loggedInUser;
    activeConversationIdRef.current = conversation?.id ?? null;
    shouldAutoScrollRef.current = true;
    previousMessagesLengthRef.current = 0;
    seenMessageIdsRef.current = new Set();
    isFetchingOlderMessagesRef.current = false;
    isLoadingOlderMessagesRef.current = false;
    hasInitialScrolledRef.current = false;
    olderMessagesScrollSnapshotRef.current = null;
    setNextMessagesCursor(null);
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
    if (!conversation?.id) return;
    if (displayMessages.length === 0) return;

    if (!hasInitialScrolledRef.current && !isLoadingMessages) {
      hasInitialScrolledRef.current = true;
      shouldAutoScrollRef.current = true;
      scrollMessagesToBottom("instant");
      return;
    }

    if (
      hasInitialScrolledRef.current &&
      shouldAutoScrollRef.current &&
      !suppressNextMessageCountRef.current
    ) {
      scrollMessagesToBottom("smooth");
    }
  }, [conversation?.id, displayMessages.length]);

  useEffect(() => {
    const previousMessagesLength = previousMessagesLengthRef.current;
    const nextMessagesLength = displayMessages.length;
    const newMessagesLength = nextMessagesLength - previousMessagesLength;

    previousMessagesLengthRef.current = nextMessagesLength;

    if (suppressNextMessageCountRef.current) {
      suppressNextMessageCountRef.current = false;
      return;
    }

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

  useLayoutEffect(() => {
    const snapshot = olderMessagesScrollSnapshotRef.current;
    const el = messagesContainerRef.current;

    if (!snapshot || !el) return;

    olderMessagesScrollSnapshotRef.current = null;
    shouldAutoScrollRef.current = false;
    el.scrollTop = el.scrollHeight - snapshot.scrollHeight + snapshot.scrollTop;
  }, [displayMessages.length]);

  if (!conversation) {
    return <EmptyConversation />;
  }

  return (
    <div className="relative flex flex-col flex-1 w-full h-full">
      <ConversationHeader
        onBack={onBack}
        conversationDisplay={conversationDisplay}
      />

      <MessagesContainer
        messagesContainerRef={messagesContainerRef}
        shouldAutoScrollRef={shouldAutoScrollRef}
        isLoadingMessages={isLoadingMessages}
        isLoadingOlderMessages={isLoadingOlderMessages}
        hasOlderMessages={!!nextMessagesCursor}
        displayMessages={displayMessages}
        messages={messages}
        isSending={isSending}
        onLoadOlderMessages={loadOlderMessages}
        setNewMessagesCount={setNewMessagesCount}
        persistAndEmitMessage={persistAndEmitMessage}
      />

      <NewMessagesButton
        newMessagesCount={newMessagesCount}
        shouldAutoScrollRef={shouldAutoScrollRef}
        setNewMessagesCount={setNewMessagesCount}
        scrollMessagesToBottom={scrollMessagesToBottom}
      />

      <ConversationFooter
        conversationId={conversation?.id}
        textareaRef={textareaRef}
        shouldAutoScrollRef={shouldAutoScrollRef}
        isSending={isSending}
        updateConversationWithMessage={updateConversationWithMessage}
        upsertMessage={upsertMessage}
        persistAndEmitMessage={persistAndEmitMessage}
      />
    </div>
  );
};

export default ConversationWindow;
