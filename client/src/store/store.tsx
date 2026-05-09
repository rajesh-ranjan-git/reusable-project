import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themeConfig } from "@/config/common.config";
import { AppStateType } from "@/types/types/store.types";
import { normalizeConversationList } from "@/helpers/store.helpers";
import { applyPresenceToConversationDisplay } from "@/helpers/conversation.helpers";

const getConversationActivityTime = (
  conversation: AppStateType["conversationList"][number],
) =>
  new Date(
    conversation.conversation.lastActivityAt ??
      conversation.conversation.lastMessage?.sentAt ??
      conversation.conversation.createdAt,
  ).getTime();

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
      onlineUserIds: null,
      setOnlineUserIds: (onlineUserIdsUpdater) =>
        set((state) => {
          const onlineUserIds =
            typeof onlineUserIdsUpdater === "function"
              ? onlineUserIdsUpdater(state.onlineUserIds)
              : onlineUserIdsUpdater;

          return {
            onlineUserIds,
            conversationList: state.conversationList.map((conversation) =>
              applyPresenceToConversationDisplay(
                conversation,
                state.loggedInUser?.userId,
                onlineUserIds,
              ),
            ),
          };
        }),
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
                    lastActivityAt: message.createdAt,
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
                const aTime = getConversationActivityTime(a);
                const bTime = getConversationActivityTime(b);

                return bTime - aTime;
              }),
          };
        }),
      clearSessionState: () =>
        set({
          accessToken: null,
          loggedInUser: null,
          currentProfileForm: null,
          conversationList: [],
          conversationListPagination: null,
          onlineUserIds: null,
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
