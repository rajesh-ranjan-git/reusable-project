"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AppSidebarProps,
  ReactNodeProps,
} from "@/types/props/common.props.types";
import { UserProfileType } from "@/types/types/profile.types";
import { RequestDirectionType } from "@/types/types/connection.types";
import {
  ConversationListResponseType,
  ProfilesResponseType,
  ResponsePaginationType,
} from "@/types/types/response.types";
import { useAppStore } from "@/store/store";
import { useToast } from "@/hooks/toast";
import { toTitleCase } from "@/utils/common.utils";
import { getConversationDisplay } from "@/helpers/conversation.helpers";
import { mergeUniqueUsersByKey } from "@/helpers/profile.helpers";
import {
  connect,
  fetchConnectionRequests,
  fetchConnections,
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
    const connectionRequestsResponse = await fetchConnectionRequests(page);

    if (connectionRequestsResponse?.success) {
      const data = connectionRequestsResponse.data as ProfilesResponseType;

      setConnectionRequests((prev) =>
        mergeUniqueUsersByKey(prev, data.users, "userId"),
      );

      setConnectionRequestsPagination(data.pagination);
    }
  }, []);

  const getConnections = useCallback(async (page: number = 1) => {
    const connectionsResponse = await fetchConnections(page);

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

    const fetchConversationsListResponse = await fetchConversationsList();

    if (
      fetchConversationsListResponse.success &&
      fetchConversationsListResponse?.data
    ) {
      const data =
        fetchConversationsListResponse.data as ConversationListResponseType;

      setConversationList(
        data.conversations.map((conversation) =>
          getConversationDisplay(conversation, loggedInUser),
        ),
      );
      setConversationListPagination(data.pagination);
    }
  }, [loggedInUser, setConversationList, setConversationListPagination]);

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
        setConnections((prev) => [selectedRequest, ...prev]);
        setConnectionsPagination((prev) =>
          prev
            ? { ...prev, total: prev.total + 1 }
            : { page: 1, limit: 10, total: 1, totalPages: 1 },
        );
      }

      const status = direction === "right" ? "accepted" : "rejected";
      const response = await connect(userId, status);

      if (!response.success) {
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

  useEffect(() => {
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

  if (!isAppRoute) return <>{children}</>;

  if (isConversationRoute) {
    return (
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
    );
  }

  return (
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
            <AppSidebar setIsSidebarOpen={setIsSidebarOpen} {...sidebarProps} />
          </div>
        )}

        {children}
      </main>

      <BottomNavbar activeTab={activeTab} />
    </div>
  );
};

export default AppChrome;
