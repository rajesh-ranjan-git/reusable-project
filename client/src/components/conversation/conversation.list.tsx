import { UIEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Socket } from "socket.io-client";
import { LuSearch } from "react-icons/lu";
import { ConversationListProps } from "@/types/props/conversation.props";
import { ConversationListResponseType } from "@/types/types/response.types";
import { LoggedInUserType } from "@/types/types/auth.types";
import { MessageResponseType } from "@/types/types/message.types";
import { useAppStore } from "@/store/store";
import { createSocketConnection } from "@/socket/socket";
import { getConversationDisplay } from "@/helpers/conversation.helpers";
import {
  fetchConversationsList,
  markMessageDelivered,
} from "@/lib/actions/conversation.action";
import { conversationRoutes } from "@/lib/routes/routes";
import FormInput from "@/components/forms/shared/form.input";

const ConversationList = ({
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  const loggedInUser = useAppStore((state) => state.loggedInUser);
  const conversationList = useAppStore((state) => state.conversationList);
  const setConversationList = useAppStore((state) => state.setConversationList);
  const conversationPagination = useAppStore(
    (state) => state.conversationListPagination,
  );
  const setConversationPagination = useAppStore(
    (state) => state.setConversationListPagination,
  );
  const resetConversationUnread = useAppStore(
    (state) => state.resetConversationUnread,
  );
  const accessToken = useAppStore((state) => state.accessToken);
  const onlineUserIds = useAppStore((state) => state.onlineUserIds);
  const updateConversationWithMessage = useAppStore(
    (state) => state.updateConversationWithMessage,
  );

  const [isLoadingMoreConversations, setIsLoadingMoreConversations] =
    useState(false);
  const socketRef = useRef<Socket | null>(null);
  const isFetchingConversationsRef = useRef(false);
  const conversationPaginationRef = useRef(conversationPagination);

  const conversationRoomKey = conversationList
    .map((conversation) => conversation.id)
    .join("|");

  conversationPaginationRef.current = conversationPagination;

  const getMessageSenderId = (message: MessageResponseType) =>
    typeof message.sender === "string" ? message.sender : message.sender.userId;

  const getMessageId = (message: MessageResponseType) =>
    message.messageId ?? message.id;

  const getConversationList = useCallback(
    async (loggedInUser: LoggedInUserType, page: number = 1) => {
      if (isFetchingConversationsRef.current) return;

      isFetchingConversationsRef.current = true;
      setIsLoadingMoreConversations(page > 1);

      const fetchConversationsListResponse = await fetchConversationsList(page);

      if (
        fetchConversationsListResponse.success &&
        fetchConversationsListResponse?.data
      ) {
        const data =
          fetchConversationsListResponse?.data as ConversationListResponseType;
        const nextConversations = data.conversations.map((conversation) =>
          getConversationDisplay(conversation, loggedInUser, onlineUserIds),
        );

        setConversationPagination(data.pagination);
        setConversationList((prev) => {
          if (page === 1) return nextConversations;

          const existingIds = new Set(
            prev.map((conversation) => conversation.id),
          );

          return [
            ...prev,
            ...nextConversations.filter(
              (conversation) => !existingIds.has(conversation.id),
            ),
          ];
        });
      } else if (page === 1) {
        setConversationPagination(null);
        setConversationList([]);
      }

      setIsLoadingMoreConversations(false);
      setTimeout(() => {
        isFetchingConversationsRef.current = false;
      }, 0);
    },
    [onlineUserIds, setConversationList, setConversationPagination],
  );

  const handleConversationListScroll = (e: UIEvent<HTMLDivElement>) => {
    const pagination = conversationPaginationRef.current;

    if (!loggedInUser || !pagination) return;
    if (pagination.page >= pagination.totalPages) return;
    if (isFetchingConversationsRef.current) return;

    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (distanceFromBottom <= 40) {
      getConversationList(loggedInUser, pagination.page + 1);
    }
  };

  const getConversationPath = (
    conversation: (typeof conversationList)[number],
  ) => {
    const userName =
      conversation.conversation.type === "direct"
        ? conversation.otherParticipants[0]?.user.userName
        : null;

    return userName
      ? `${conversationRoutes.conversation}/${encodeURIComponent(userName)}`
      : conversationRoutes.conversation;
  };

  useEffect(() => {
    if (loggedInUser && conversationList.length === 0) {
      getConversationList(loggedInUser);
    }
  }, [conversationList.length, getConversationList, loggedInUser]);

  useEffect(() => {
    if (!accessToken || conversationList.length === 0) return;

    const socket = createSocketConnection({ token: accessToken });
    socketRef.current = socket;

    useAppStore.getState().conversationList.forEach((conversation) => {
      if (conversation.conversation.type === "direct") {
        const targetUserId = conversation.otherParticipants[0]?.user.userId;
        if (targetUserId) socket.emit("join-chat", { targetUserId });
        return;
      }

      socket.emit("join-group-chat", {
        conversationId: conversation.id,
      });
    });

    const handleLiveMessage = (message: MessageResponseType) => {
      updateConversationWithMessage(message, {
        activeConversationId: selectedConversationId,
      });

      const messageId = getMessageId(message);
      const senderId = getMessageSenderId(message);
      const matchedConversation = useAppStore
        .getState()
        .conversationList.find(
          (conversation) => conversation.id === message.conversation,
        );

      if (
        !messageId ||
        !senderId ||
        senderId === loggedInUser?.userId ||
        selectedConversationId === message.conversation ||
        !matchedConversation
      ) {
        return;
      }

      void markMessageDelivered(message.conversation, messageId);

      if (matchedConversation.conversation.type === "direct") {
        socket.emit("message-delivered", {
          targetUserId: senderId,
          messageId,
        });
        return;
      }

      socket.emit("group-message-delivered", {
        conversationId: message.conversation,
        messageId,
      });
    };

    socket.on("received-message", handleLiveMessage);
    socket.on("received-group-message", handleLiveMessage);

    return () => {
      socket.off("received-message", handleLiveMessage);
      socket.off("received-group-message", handleLiveMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    accessToken,
    conversationList.length,
    conversationRoomKey,
    loggedInUser?.userId,
    selectedConversationId,
    updateConversationWithMessage,
  ]);

  return (
    <div className="flex flex-col bg-surface md:bg-transparent border-glass-border md:border-r w-full md:w-72 lg:w-80 h-full shrink-0">
      <div className="bg-glass-bg p-4 pb-2 border-glass-border border-b">
        <h4 className="mb-2 tracking-wide">Messages</h4>
        <div className="relative flex-1 max-w-md">
          <FormInput
            placeholder="Search messages..."
            startIcon={<LuSearch />}
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        onScroll={handleConversationListScroll}
      >
        {conversationList.length > 0 ? (
          <>
            {conversationList.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => {
                  window.history.pushState(
                    {},
                    "",
                    getConversationPath(conversation),
                  );
                  onSelectConversation(conversation.conversation);
                  resetConversationUnread(conversation.id);
                }}
                className={`w-full text-left p-3 flex gap-2 items-center border-b border-glass-border duration-200 hover:bg-glass-bg-subtle ${selectedConversationId === conversation.id ? "bg-glass-bg-strong" : "bg-glass-bg"}`}
              >
                <div className="relative shrink-0">
                  <Image
                    src={conversation.avatar}
                    alt={conversation.title}
                    width={100}
                    height={100}
                    className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
                  />
                  {conversation.isOnline ? (
                    <span className="right-0 bottom-0 absolute bg-green-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
                  ) : (
                    <span className="right-0 bottom-0 absolute bg-gray-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h6 className="font-medium text-text-primary truncate">
                      {conversation.title}
                    </h6>
                    <span className="ml-2 text-text-secondary text-xs shrink-0">
                      {conversation.lastActivity}
                    </span>
                  </div>
                  <p className="font-light text-text-secondary text-sm truncate">
                    {conversation.subtitle}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="flex justify-center items-center bg-status-info-bg border border-status-info-border rounded-full w-5 h-5 shrink-0">
                    <span className="font-bold text-[10px] text-status-info-text">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </button>
            ))}

            {isLoadingMoreConversations && (
              <div className="py-3 text-text-secondary text-sm text-center">
                Loading more conversations...
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="my-auto text-sm text-center">
              No conversation available yet...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
