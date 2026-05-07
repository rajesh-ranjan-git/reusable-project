"use client";

import { useEffect, useState } from "react";
import { ConversationPageProps } from "@/types/props/conversation.props";
import {
  ConversationResponseType,
  DirectConversationResponseType,
} from "@/types/types/response.types";
import { fetchDirectConversation } from "@/lib/actions/conversation.action";
import BottomNavbar from "@/components/layout/bottom.navbar";
import ConversationList from "@/components/conversation/conversation.list";
import ConversationWindow from "@/components/conversation/conversation.window";

const ConversationPage = ({ userName }: ConversationPageProps) => {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponseType | null>(null);

  const getDirectConversation = async (userName: string) => {
    const directConversationResponse = await fetchDirectConversation(userName);

    if (directConversationResponse.success && directConversationResponse.data) {
      const data =
        directConversationResponse.data as DirectConversationResponseType;

      setSelectedConversation(data.conversation);
    }
  };

  useEffect(() => {
    if (!userName) return;

    getDirectConversation(userName);
  }, [userName]);

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
            onBack={() => setSelectedConversation(null)}
          />
        </div>
      </main>

      <BottomNavbar activeTab="chats" hidden={!!selectedConversation} />
    </>
  );
};

export default ConversationPage;
