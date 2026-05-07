import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themeConfig } from "@/config/common.config";
import { AppStateType } from "@/types/types/store.types";
import { ConversationDisplayType } from "@/types/types/conversation.types";

const getConversationUniqueKey = (
  conversation: ConversationDisplayType,
  currentUserId?: string,
) => {
  if (conversation.conversation.type !== "direct") return conversation.id;

  const otherParticipantIds = conversation.conversation.participants
    .map((participant) => participant.user.userId)
    .filter((userId) => userId && userId !== currentUserId)
    .sort();

  return otherParticipantIds.length > 0
    ? `direct:${otherParticipantIds.join("|")}`
    : conversation.id;
};

const normalizeConversationList = (
  conversations: ConversationDisplayType[],
  currentUserId?: string,
) => {
  const conversationMap = new Map<string, ConversationDisplayType>();

  conversations.forEach((conversation) => {
    const key = getConversationUniqueKey(conversation, currentUserId);
    const existingConversation = conversationMap.get(key);

    if (!existingConversation) {
      conversationMap.set(key, conversation);
      return;
    }

    const existingTime = new Date(
      existingConversation.conversation.lastMessage?.sentAt ??
        existingConversation.conversation.updatedAt,
    ).getTime();
    const nextTime = new Date(
      conversation.conversation.lastMessage?.sentAt ??
        conversation.conversation.updatedAt,
    ).getTime();

    if (nextTime >= existingTime) {
      conversationMap.set(key, conversation);
    }
  });

  return [...conversationMap.values()];
};

export const useAppStore = create<AppStateType>()(
  persist(
    (set) => ({
      activeTheme: themeConfig.dark,
      setActiveTheme: (themeOrUpdater) =>
        set((state) => ({
          activeTheme:
            typeof themeOrUpdater === "function"
              ? themeOrUpdater(state.activeTheme)
              : themeOrUpdater,
        })),
      accessToken: null,
      setAccessToken: (accessTokenUpdater) =>
        set((state) => ({
          accessToken:
            typeof accessTokenUpdater === "function"
              ? accessTokenUpdater(state.accessToken)
              : accessTokenUpdater,
        })),
      loggedInUser: null,
      setLoggedInUser: (loggedInUserUpdater) =>
        set((state) => ({
          loggedInUser:
            typeof loggedInUserUpdater === "function"
              ? loggedInUserUpdater(state.loggedInUser)
              : loggedInUserUpdater,
        })),
      isLoggingOut: false,
      setIsLoggingOut: (isLoggingOutUpdater) =>
        set((state) => ({
          isLoggingOut:
            typeof isLoggingOutUpdater === "function"
              ? isLoggingOutUpdater(state.isLoggingOut)
              : isLoggingOutUpdater,
        })),
      currentProfileForm: null,
      setCurrentProfileForm: (currentProfileFormUpdater) =>
        set((state) => ({
          currentProfileForm:
            typeof currentProfileFormUpdater === "function"
              ? currentProfileFormUpdater(state.currentProfileForm)
              : currentProfileFormUpdater,
        })),
      conversationList: [],
      setConversationList: (conversationListUpdater) =>
        set((state) => ({
          conversationList: normalizeConversationList(
            typeof conversationListUpdater === "function"
              ? conversationListUpdater(state.conversationList)
              : conversationListUpdater,
            state.loggedInUser?.userId,
          ),
        })),
      conversationListPagination: null,
      setConversationListPagination: (conversationListPaginationUpdater) =>
        set((state) => ({
          conversationListPagination:
            typeof conversationListPaginationUpdater === "function"
              ? conversationListPaginationUpdater(
                  state.conversationListPagination,
                )
              : conversationListPaginationUpdater,
        })),
      resetConversationUnread: (conversationId) =>
        set((state) => ({
          conversationList: state.conversationList.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  unreadCount: 0,
                  conversation: {
                    ...conversation.conversation,
                    participants: conversation.conversation.participants.map(
                      (participant) =>
                        participant.user.userId === state.loggedInUser?.userId
                          ? { ...participant, unreadCount: 0 }
                          : participant,
                    ),
                  },
                }
              : conversation,
          ),
        })),
      updateConversationWithMessage: (message, options) =>
        set((state) => {
          const senderId =
            typeof message.sender === "string"
              ? message.sender
              : message.sender.userId;
          const isOwnMessage = senderId === state.loggedInUser?.userId;

          return {
            conversationList: state.conversationList
              .map((conversation) => {
                if (conversation.id !== message.conversation) {
                  return conversation;
                }

                const isActive =
                  options?.activeConversationId === conversation.id;
                const shouldIncrementUnread =
                  options?.incrementUnread !== false &&
                  !isOwnMessage &&
                  !isActive;
                const unreadCount = isActive
                  ? 0
                  : conversation.unreadCount + (shouldIncrementUnread ? 1 : 0);

                return {
                  ...conversation,
                  subtitle: message.content,
                  lastActivity: new Date(message.createdAt).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  ),
                  unreadCount,
                  conversation: {
                    ...conversation.conversation,
                    lastMessage: {
                      messageId: message.messageId ?? message.id ?? "",
                      content: message.content,
                      contentType: message.contentType,
                      sentBy: senderId,
                      sentAt: message.createdAt,
                    },
                    updatedAt: message.createdAt,
                    participants: conversation.conversation.participants.map(
                      (participant) =>
                        participant.user.userId === state.loggedInUser?.userId
                          ? { ...participant, unreadCount }
                          : participant,
                    ),
                  },
                };
              })
              .sort((a, b) => {
                const aTime = new Date(
                  a.conversation.lastMessage?.sentAt ??
                    a.conversation.updatedAt,
                ).getTime();
                const bTime = new Date(
                  b.conversation.lastMessage?.sentAt ??
                    b.conversation.updatedAt,
                ).getTime();

                return bTime - aTime;
              }),
          };
        }),
    }),
    {
      name: "app-storage",
      version: 1,
      partialize: (state) => ({
        activeTheme: state.activeTheme,
        loggedInUser: state.loggedInUser,
      }),
    },
  ),
);
