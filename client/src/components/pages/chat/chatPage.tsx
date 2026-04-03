"use client";

import { useState } from "react";
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottomNav";
import ChatList from "@/components/chat/chatList";
import ChatWindow from "@/components/chat/chatWindow";

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="flex flex-col bg-bg-page h-dvh overflow-hidden text-text-primary">
      <Header />

      <main className="relative flex flex-1 overflow-hidden">
        <div
          className={`w-full h-full pb-16 md:pb-0 md:w-72 lg:w-80 shrink-0 md:flex ${selectedChat ? "hidden md:flex" : "flex"}`}
        >
          <ChatList
            selectedChatId={selectedChat?.id ?? null}
            onSelectChat={setSelectedChat}
          />
        </div>

        <div
          className={`flex-1 h-full absolute inset-0 md:static md:flex bg-bg ${selectedChat ? "flex z-20" : "hidden md:flex"}`}
        >
          <ChatWindow
            chat={selectedChat}
            onBack={() => setSelectedChat(null)}
          />
        </div>
      </main>

      <BottomNav activeTab="chats" hidden={!!selectedChat} />
    </div>
  );
}
