import { staticImages } from "@/config/common.config";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { LuSearch } from "react-icons/lu";

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

type ChatListProps = {
  selectedChatId: number | null;
  onSelectChat: (chat: Chat) => void;
};

const mockChats: Chat[] = [
  {
    id: 1,
    name: "Alice Cooper",
    avatar: "https://i.pravatar.cc/150?u=alice",
    lastMessage: "Hey, I checked out your recent PR!",
    time: "10:42 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "https://i.pravatar.cc/150?u=bob",
    lastMessage: "Let's collaborate on that side project.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 5,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 6,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 7,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 8,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 9,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 10,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
];

export default function ChatList({
  selectedChatId,
  onSelectChat,
}: ChatListProps) {
  return (
    <div className="flex flex-col bg-surface md:bg-transparent border-glass-border md:border-r w-full md:w-72 lg:w-80 h-full shrink-0">
      <div className="bg-glass-bg p-4 border-glass-border border-b">
        <h4 className="mb-2 font-arima tracking-wider">Messages</h4>
        <div className="relative flex-1 max-w-md">
          <LuSearch className="top-1/2 left-3 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />
          <input
            type="search"
            className="py-1 pl-9 rounded-full"
            placeholder="Search messages..."
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mockChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full text-left p-3 flex gap-2 items-center border-b border-glass-border duration-200 hover:bg-glass-bg-subtle ${selectedChatId === chat.id ? "bg-glass-bg-strong" : "bg-glass-bg"}`}
          >
            <div className="relative shrink-0">
              <Image
                src={staticImages.avatarPlaceholder.src}
                alt={staticImages.avatarPlaceholder.alt}
                width={100}
                height={100}
                className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
              />
              {chat.online && (
                <span className="right-0 bottom-0 absolute bg-green-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h6 className="font-medium text-text-primary truncate">
                  {chat.name}
                </h6>
                <span className="ml-2 text-text-secondary text-xs shrink-0">
                  {chat.time}
                </span>
              </div>
              <p className="font-light text-text-secondary text-sm truncate">
                {chat.lastMessage}
              </p>
            </div>
            {chat.unread > 0 && (
              <div className="flex justify-center items-center bg-status-info-bg border border-status-info-border rounded-full w-5 h-5 shrink-0">
                <span className="font-bold text-[10px] text-status-info-text">
                  {chat.unread}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
