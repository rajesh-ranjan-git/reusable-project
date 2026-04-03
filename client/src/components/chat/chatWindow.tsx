import {
  LuArrowLeft,
  LuMessageSquare,
  LuPaperclip,
  LuPhone,
  LuSend,
  LuVideo,
} from "react-icons/lu";
import { IoMdMore } from "react-icons/io";
import MessageBubble from "@/components/chat/messageBubble";

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

type Message = {
  id: number;
  text: string;
  time: string;
  isOwn: boolean;
};

type ChatWindowProps = { chat: Chat | null; onBack: () => void };

const mockMessages: Message[] = [
  {
    id: 1,
    text: "Hey, I checked out your recent PR!",
    time: "10:40 AM",
    isOwn: false,
  },
  {
    id: 2,
    text: "Thanks! Let me know if you see any issues.",
    time: "10:41 AM",
    isOwn: true,
  },
  {
    id: 3,
    text: "It looks solid. We should definitely collaborate on a side project soon.",
    time: "10:42 AM",
    isOwn: false,
  },
];

export default function ChatWindow({ chat, onBack }: ChatWindowProps) {
  if (!chat) {
    return (
      <div className="hidden relative md:flex flex-col flex-1 justify-center items-center bg-bg">
        <div className="flex justify-center items-center bg-black/5 dark:bg-white/5 shadow-sm dark:shadow-lg mb-4 border border-black/10 dark:border-white/10 rounded-full w-16 h-16 text-text-secondary">
          <LuMessageSquare size={32} />
        </div>
        <h3 className="mb-2 font-medium text-text-primary text-xl">
          Your Messages
        </h3>
        <p className="text-text-secondary">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col flex-1 bg-bg w-full h-full">
      {/* Header */}
      <div className="z-(--z-raised) flex justify-between items-center bg-white/90 dark:bg-surface/50 backdrop-blur-md px-4 border-black/10 dark:border-white/10 border-b w-full h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            <LuArrowLeft size={20} />
          </button>
          <img
            src={chat.avatar}
            alt={chat.name}
            className="rounded-full w-10 h-10 object-cover"
          />
          <div>
            <h3 className="font-medium text-text-primary text-sm md:text-base">
              {chat.name}
            </h3>
            <p className="text-text-secondary text-xs">
              {chat.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-text-secondary">
          <button className="p-2 hover:text-text-primary transition-colors">
            <LuPhone size={20} />
          </button>
          <button className="p-2 hover:text-text-primary transition-colors">
            <LuVideo size={20} />
          </button>
          <button className="p-2 hover:text-text-primary transition-colors">
            <IoMdMore size={20} />
          </button>
        </div>
      </div>

      <div className="z-(--z-base) relative flex flex-col flex-1 p-4 pb-20 md:pb-4 overflow-y-auto custom-scrollbar">
        <div className="my-4 font-medium text-text-secondary text-xs text-center">
          Yesterday
        </div>
        {mockMessages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.isOwn} />
        ))}
        <div className="my-4 font-medium text-text-secondary text-xs text-center">
          Today
        </div>
        {mockMessages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.isOwn} />
        ))}
      </div>

      <div className="bottom-0 z-(--z-raised) md:static absolute bg-white/80 dark:bg-surface/80 backdrop-blur-xl p-3 md:p-4 border-black/10 dark:border-white/10 border-t w-full">
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-2 py-2 border border-black/10 focus-within:border-primary/50 dark:border-white/10 rounded-xl transition-colors">
          <button className="hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
            <LuPaperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 w-full placeholder-text-secondary text-text-primary text-sm"
          />
          <button className="flex justify-center items-center bg-primary hover:bg-indigo-700 shadow-md p-2.5 rounded-lg text-white transition-all">
            <LuSend size={16} className="mt-0.5 -ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
