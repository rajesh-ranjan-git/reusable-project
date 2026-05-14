"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Socket } from "socket.io-client";
import {
  AppSidebarProps,
  ReactNodeProps,
} from "@/types/props/common.props.types";
import { UserProfileType } from "@/types/types/profile.types";
import {
  ConnectionStatusType,
  RequestDirectionType,
} from "@/types/types/connection.types";
import {
  ConversationListResponseType,
  ProfilesResponseType,
  ResponsePaginationType,
} from "@/types/types/response.types";
import { useAppStore } from "@/store/store";
import { useToast } from "@/hooks/toast";
import {
  createSocketConnection,
  disconnectSocketConnection,
} from "@/socket/socket";
import {
  NetworkActionsProvider,
  RelationshipOverrideType,
} from "@/hooks/useNetworkActions";
import { toTitleCase } from "@/utils/common.utils";
import { getConversationDisplay } from "@/helpers/conversation.helpers";
import { mergeUniqueUsersByKey } from "@/helpers/profile.helpers";
import {
  fetchConnectionRequests,
  fetchConnections,
  legacyConnect,
} from "@/lib/actions/connection.actions";
import { fetchConversationsList } from "@/lib/actions/conversation.action";
import Header from "@/components/layout/header";
import AppSidebar from "@/components/layout/app.sidebar";
import BottomNavbar from "@/components/layout/bottom.navbar";

const APP_ROUTES = ["/discover", "/profile", "/conversation"];

const AppChrome = ({ children }: ReactNodeProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState<
    UserProfileType[]
  >([]);
  const [connections, setConnections] = useState<UserProfileType[]>([]);
  const [relationshipOverrides, setRelationshipOverrides] = useState<
    Record<string, RelationshipOverrideType>
  >({});
  const [exitDirection, setExitDirection] = useState<
    Record<string, RequestDirectionType>
  >({});
  const [connectionRequestsPagination, setConnectionRequestsPagination] =
    useState<ResponsePaginationType | null>(null);
  const [connectionsPagination, setConnectionsPagination] =
    useState<ResponsePaginationType | null>(null);

  const pathname = usePathname();

  const loggedInUser = useAppStore((state) => state.loggedInUser);
  const accessToken = useAppStore((state) => state.accessToken);
  const conversationList = useAppStore((state) => state.conversationList);
  const setConversationList = useAppStore((state) => state.setConversationList);
  const onlineUserIds = useAppStore((state) => state.onlineUserIds);
  const setOnlineUserIds = useAppStore((state) => state.setOnlineUserIds);
  const setConversationListPagination = useAppStore(
    (state) => state.setConversationListPagination,
  );
  const { showToast } = useToast();

  const isAppRoute = APP_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const hasNetworkSidebar =
    pathname === "/discover" ||
    pathname.startsWith("/profile") ||
    pathname === "/conversation";
  const isConversationRoute = pathname.startsWith("/conversation");
  const activeTab = pathname.startsWith("/profile")
    ? "profile"
    : pathname.startsWith("/conversation")
      ? "chats"
      : "discover";
  const sidebarClassName =
    pathname === "/discover" ? "hidden xl:flex" : "hidden md:flex";
  const backgroundClassName = pathname.startsWith("/profile")
    ? "bg-bg"
    : "bg-bg-page";

  const getConnectionRequests = useCallback(async (page: number = 1) => {
    const currentUserId = useAppStore.getState().loggedInUser?.userId;
    if (!currentUserId) return;

    const connectionRequestsResponse = await fetchConnectionRequests(page);
    if (useAppStore.getState().loggedInUser?.userId !== currentUserId) return;

    if (connectionRequestsResponse?.success) {
      const data = connectionRequestsResponse.data as ProfilesResponseType;

      setConnectionRequests((prev) =>
        mergeUniqueUsersByKey(prev, data.users, "userId"),
      );

      setConnectionRequestsPagination(data.pagination);
    }
  }, []);

  const getConnections = useCallback(async (page: number = 1) => {
    const currentUserId = useAppStore.getState().loggedInUser?.userId;
    if (!currentUserId) return;

    const connectionsResponse = await fetchConnections(page);
    if (useAppStore.getState().loggedInUser?.userId !== currentUserId) return;

    if (connectionsResponse?.success) {
      const data = connectionsResponse.data as ProfilesResponseType;

      setConnections((prev) =>
        mergeUniqueUsersByKey(prev, data.users, "userId"),
      );

      setConnectionsPagination(data.pagination);
    }
  }, []);

  const getConversationList = useCallback(async () => {
    if (!loggedInUser) return;

    const currentUserId = loggedInUser.userId;
    const fetchConversationsListResponse = await fetchConversationsList();
    if (useAppStore.getState().loggedInUser?.userId !== currentUserId) return;

    if (
      fetchConversationsListResponse.success &&
      fetchConversationsListResponse?.data
    ) {
      const data =
        fetchConversationsListResponse.data as ConversationListResponseType;

      setConversationList(
        data.conversations.map((conversation) =>
          getConversationDisplay(conversation, loggedInUser, onlineUserIds),
        ),
      );
      setConversationListPagination(data.pagination);
    }
  }, [
    loggedInUser,
    onlineUserIds,
    setConversationList,
    setConversationListPagination,
  ]);

  const handleRequestAction = useCallback(
    async (userId: string, direction: RequestDirectionType) => {
      const selectedRequest = connectionRequests.find(
        (r) => r.userId === userId,
      );

      setExitDirection((prev) => ({ ...prev, [userId]: direction }));

      if (selectedRequest) {
        setConnectionRequests((prev) =>
          prev.filter((r) => r.userId !== userId),
        );
        setConnectionRequestsPagination((prev) =>
          prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev,
        );
      }

      if (direction === "right" && selectedRequest) {
        setConnections((prev) => [
          {
            ...selectedRequest,
            connectionStatus: "accepted",
            connectionDirection: null,
          },
          ...prev,
        ]);
        setConnectionsPagination((prev) =>
          prev
            ? { ...prev, total: prev.total + 1 }
            : { page: 1, limit: 10, total: 1, totalPages: 1 },
        );
      }

      const status = direction === "right" ? "accepted" : "rejected";
      setRelationshipOverrides((prev) => ({
        ...prev,
        [userId]: {
          connectionStatus: status,
          connectionDirection: null,
        },
      }));

      const response = await legacyConnect(userId, status);

      if (!response.success) {
        setRelationshipOverrides((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });

        if (selectedRequest) {
          setConnectionRequests((prev) =>
            mergeUniqueUsersByKey([selectedRequest], prev, "userId"),
          );
          setConnectionRequestsPagination((prev) =>
            prev ? { ...prev, total: prev.total + 1 } : prev,
          );
        }

        if (direction === "right" && selectedRequest) {
          setConnections((prev) => prev.filter((c) => c.userId !== userId));
          setConnectionsPagination((prev) =>
            prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev,
          );
        }

        showToast({
          title: toTitleCase(response.code),
          message: response.message ?? "",
          variant: "error",
        });

        return false;
      }

      if (!selectedRequest) {
        setConnectionRequestsPagination((prev) =>
          prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev,
        );

        if (direction === "right") {
          setConnectionsPagination((prev) =>
            prev ? { ...prev, total: prev.total + 1 } : prev,
          );
          getConnections();
        }

        getConnectionRequests();
      }

      return true;
    },
    [connectionRequests, getConnectionRequests, getConnections, showToast],
  );

  const handleConnectionAction = useCallback(
    async (profile: UserProfileType, status: ConnectionStatusType) => {
      const previousOverride = relationshipOverrides[profile.userId];
      const wasConnected = connections.some((c) => c.userId === profile.userId);
      const shouldRemoveDirectConversation = [
        "rejected",
        "not-interested",
        "blocked",
      ].includes(status);
      const removedConversations = shouldRemoveDirectConversation
        ? conversationList.filter(
            (conversation) =>
              conversation.conversation.type === "direct" &&
              conversation.otherParticipants.some(
                (participant) => participant.user.userId === profile.userId,
              ),
          )
        : [];
      const nextOverride: RelationshipOverrideType = {
        connectionStatus: status,
        connectionDirection: status === "interested" ? "outgoing" : null,
      };

      setRelationshipOverrides((prev) => ({
        ...prev,
        [profile.userId]: nextOverride,
      }));

      if (status === "rejected" && wasConnected) {
        setConnections((prev) =>
          prev.filter((connection) => connection.userId !== profile.userId),
        );
        setConnectionsPagination((prev) =>
          prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev,
        );
      }

      if (removedConversations.length > 0) {
        setConversationList((prev) =>
          prev.filter((conversation) => {
            return !removedConversations.some(
              (removedConversation) =>
                removedConversation.id === conversation.id,
            );
          }),
        );

        setConversationListPagination((prev) =>
          prev
            ? {
                ...prev,
                total: Math.max(0, prev.total - removedConversations.length),
                totalPages: Math.max(
                  1,
                  Math.ceil(
                    Math.max(0, prev.total - removedConversations.length) /
                      prev.limit,
                  ),
                ),
              }
            : prev,
        );
      }

      const response = await legacyConnect(profile.userId, status);

      if (!response.success) {
        setRelationshipOverrides((prev) => {
          const next = { ...prev };

          if (previousOverride) {
            next[profile.userId] = previousOverride;
          } else {
            delete next[profile.userId];
          }

          return next;
        });

        if (status === "rejected" && wasConnected) {
          setConnections((prev) =>
            mergeUniqueUsersByKey([profile], prev, "userId"),
          );
          setConnectionsPagination((prev) =>
            prev ? { ...prev, total: prev.total + 1 } : prev,
          );
        }

        if (removedConversations.length > 0) {
          setConversationList((prev) =>
            mergeUniqueUsersByKey(removedConversations, prev, "id"),
          );
          setConversationListPagination((prev) =>
            prev
              ? {
                  ...prev,
                  total: prev.total + removedConversations.length,
                  totalPages: Math.ceil(
                    (prev.total + removedConversations.length) / prev.limit,
                  ),
                }
              : prev,
          );
        }

        showToast({
          title: toTitleCase(response.code),
          message: response.message ?? "",
          variant: "error",
        });

        return false;
      }

      return true;
    },
    [
      connections,
      conversationList,
      relationshipOverrides,
      setConversationList,
      setConversationListPagination,
      showToast,
    ],
  );

  useEffect(() => {
    setConnectionRequests([]);
    setConnections([]);
    setRelationshipOverrides({});
    setExitDirection({});
    setConnectionRequestsPagination(null);
    setConnectionsPagination(null);

    if (loggedInUser?.userId) {
      getConnectionRequests();
      getConnections();
    }
  }, [getConnectionRequests, getConnections, loggedInUser?.userId]);

  useEffect(() => {
    if (
      !accessToken ||
      !loggedInUser ||
      isConversationRoute ||
      conversationList.length > 0
    ) {
      return;
    }

    getConversationList();
  }, [
    accessToken,
    conversationList.length,
    getConversationList,
    isConversationRoute,
    loggedInUser,
  ]);

  useEffect(() => {
    if (!accessToken || !loggedInUser?.userId) {
      setOnlineUserIds(null);
      return;
    }

    const socket: Socket = createSocketConnection({ token: accessToken });

    socket.on("online-users", (userIds: string[]) => {
      setOnlineUserIds(userIds.map(String));
    });

    return () => {
      socket.off("online-users");
      disconnectSocketConnection();
      setOnlineUserIds(null);
    };
  }, [accessToken, loggedInUser?.userId, setOnlineUserIds]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const sidebarProps = useMemo<Omit<AppSidebarProps, "setIsSidebarOpen">>(
    () => ({
      connectionRequests,
      connections,
      exitDirection,
      connectionRequestsPagination,
      connectionsPagination,
      onRequestAction: handleRequestAction,
      onLoadMoreRequests: getConnectionRequests,
      onLoadMoreConnections: getConnections,
    }),
    [
      connectionRequests,
      connections,
      exitDirection,
      connectionRequestsPagination,
      connectionsPagination,
      handleRequestAction,
      getConnectionRequests,
      getConnections,
    ],
  );

  const networkActionsValue = useMemo(
    () => ({
      connectionRequests,
      connections,
      relationshipOverrides,
      onRequestAction: handleRequestAction,
      onConnectionAction: handleConnectionAction,
    }),
    [
      connectionRequests,
      connections,
      relationshipOverrides,
      handleRequestAction,
      handleConnectionAction,
    ],
  );

  if (!isAppRoute) return <>{children}</>;

  if (isConversationRoute) {
    return (
      <NetworkActionsProvider value={networkActionsValue}>
        <div
          className={`flex flex-col ${backgroundClassName} h-dvh overflow-hidden text-text-primary`}
        >
          <Header
            type="default"
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            sidebarProps={sidebarProps}
          />

          {children}
        </div>
      </NetworkActionsProvider>
    );
  }

  return (
    <NetworkActionsProvider value={networkActionsValue}>
      <div
        className={`flex flex-col ${backgroundClassName} h-dvh overflow-hidden text-text-primary`}
      >
        <Header
          type="default"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sidebarProps={sidebarProps}
        />

        <main className="relative flex flex-1 overflow-hidden">
          {hasNetworkSidebar && (
            <div className={sidebarClassName}>
              <AppSidebar
                setIsSidebarOpen={setIsSidebarOpen}
                {...sidebarProps}
              />
            </div>
          )}

          {children}
        </main>

        <BottomNavbar activeTab={activeTab} />
      </div>
    </NetworkActionsProvider>
  );
};

export default AppChrome;
