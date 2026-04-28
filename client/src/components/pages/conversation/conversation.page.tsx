"use client";

import { useEffect, useState } from "react";
import { ConversationType } from "@/types/types/conversation.types";
import { ConversationPageProps } from "@/types/props/conversation.props";
import { fetchDirectConversation } from "@/lib/actions/conversation.action";
import Header from "@/components/layout/header";
import BottomNavbar from "@/components/layout/bottom.navbar";
import ConversationList from "@/components/conversation/conversation.list";
import ConversationWindow from "@/components/conversation/conversation.window";

const ConversationPage = ({ userName }: ConversationPageProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);

  const getDirectConversation = async (userName: string) => {
    const directConversationResponse = await fetchDirectConversation(userName);

    logger.debug(
      "debug directConversationResponse:",
      directConversationResponse,
    );
  };

  useEffect(() => {
    if (userName) {
      getDirectConversation(userName);
    }
  }, [userName]);

  return (
    <div className="flex flex-col bg-bg-page h-dvh overflow-hidden text-text-primary">
      <Header
        type="default"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

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
    </div>
  );
};

export default ConversationPage;
