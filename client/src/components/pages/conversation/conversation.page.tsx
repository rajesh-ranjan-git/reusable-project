"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConversationPageProps } from "@/types/props/conversation.props";
import {
  ConversationResponseType,
  DirectConversationResponseType,
} from "@/types/types/response.types";
import { useAppStore } from "@/store/store";
import { useNetworkActions } from "@/hooks/useNetworkActions";
import { getConversationDisplay } from "@/helpers/conversation.helpers";
import { fetchDirectConversation } from "@/lib/actions/conversation.action";
import { conversationRoutes } from "@/lib/routes/routes";
import BottomNavbar from "@/components/layout/bottom.navbar";
import ConversationList from "@/components/conversation/conversation.list";
import ConversationWindow from "@/components/conversation/conversation.window";

const ConversationPage = ({ userName }: ConversationPageProps) => {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponseType | null>(null);

  const router = useRouter();

  const setConversationList = useAppStore((state) => state.setConversationList);
  const setConversationListPagination = useAppStore(
    (state) => state.setConversationListPagination,
  );
  const onlineUserIds = useAppStore((state) => state.onlineUserIds);

  const networkActions = useNetworkActions();

  const upsertConversationListItem = useCallback(
    (conversation: ConversationResponseType) => {
      const loggedInUser = useAppStore.getState().loggedInUser;
      if (!loggedInUser) return;

      let isNewConversation = false;
      const conversationDisplay = getConversationDisplay(
        conversation,
        loggedInUser,
        onlineUserIds,
      );

      setConversationList((prev) => {
        const existingConversationIndex = prev.findIndex(
          (currentConversation) =>
            currentConversation.id === conversationDisplay.id,
        );
        isNewConversation = existingConversationIndex === -1;

        if (isNewConversation) return [conversationDisplay, ...prev];

        return prev.map((currentConversation, index) =>
          index === existingConversationIndex
            ? conversationDisplay
            : currentConversation,
        );
      });

      if (isNewConversation) {
        setConversationListPagination((prev) =>
          prev
            ? {
                ...prev,
                total: prev.total + 1,
                totalPages: Math.ceil((prev.total + 1) / prev.limit),
              }
            : prev,
        );
      }
    },
    [onlineUserIds, setConversationList, setConversationListPagination],
  );

  const clearSelectedConversation = useCallback(() => {
    router.push(conversationRoutes.conversation);
    setSelectedConversation(null);
  }, [router]);

  const getDirectConversation = useCallback(
    async (userName: string) => {
      const directConversationResponse =
        await fetchDirectConversation(userName);

      if (
        directConversationResponse.success &&
        directConversationResponse.data
      ) {
        const data =
          directConversationResponse.data as DirectConversationResponseType;

        setSelectedConversation(data.conversation);
        upsertConversationListItem(data.conversation);
      } else {
        clearSelectedConversation();
      }
    },
    [clearSelectedConversation, upsertConversationListItem],
  );

  const syncConversationFromPath = useCallback(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const routeUserName =
      pathParts[0] === "conversation" ? pathParts[1] : undefined;

    if (routeUserName) {
      getDirectConversation(decodeURIComponent(routeUserName));
      return;
    }

    setSelectedConversation(null);
  }, [getDirectConversation]);

  useEffect(() => {
    if (!userName) return;

    getDirectConversation(userName);
  }, [getDirectConversation, userName]);

  useEffect(() => {
    window.addEventListener("popstate", syncConversationFromPath);

    return () => {
      window.removeEventListener("popstate", syncConversationFromPath);
    };
  }, [syncConversationFromPath]);

  useEffect(() => {
    if (!selectedConversation || selectedConversation.type !== "direct") return;

    const targetUser = selectedConversation.participants.find(
      (participant) =>
        participant.user.userId !== useAppStore.getState().loggedInUser?.userId,
    )?.user;

    if (!targetUser?.userId) return;

    const relationshipOverride =
      networkActions?.relationshipOverrides[targetUser.userId];

    if (
      relationshipOverride?.connectionStatus &&
      relationshipOverride.connectionStatus !== "accepted"
    ) {
      clearSelectedConversation();
    }
  }, [
    clearSelectedConversation,
    networkActions?.relationshipOverrides,
    selectedConversation,
  ]);

  return (
    <>
      <main className="relative flex flex-1 overflow-hidden">
        <div
          className={`w-full h-full pb-16 md:pb-0 md:w-72 lg:w-80 shrink-0 md:flex ${selectedConversation ? "hidden md:flex" : "flex"}`}
        >
          <ConversationList
            selectedConversationId={selectedConversation?.id ?? null}
            onSelectConversation={setSelectedConversation}
          />
        </div>

        <div
          className={`flex-1 h-full absolute inset-0 md:static md:flex bg-bg ${selectedConversation ? "flex z-20" : "hidden md:flex"}`}
        >
          <ConversationWindow
            conversation={selectedConversation}
            onBack={clearSelectedConversation}
          />
        </div>
      </main>

      <BottomNavbar activeTab="chats" hidden={!!selectedConversation} />
    </>
  );
};

export default ConversationPage;
