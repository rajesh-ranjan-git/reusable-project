import { useRef, KeyboardEvent } from "react";
import Image from "next/image";
import {
  LuArrowLeft,
  LuMessageSquare,
  LuPaperclip,
  LuPhone,
  LuSend,
  LuVideo,
} from "react-icons/lu";
import { IoMdMore } from "react-icons/io";
import { staticImages } from "@/config/common.config";
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

const ChatWindow = ({ chat, onBack }: ChatWindowProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);

    const maxHeight = lineHeight * 3;

    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  };

  const resetHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      resetHeight();
    }
  };

  if (!chat) {
    return (
      <div className="hidden relative md:flex flex-col flex-1 justify-center items-center gap-2">
        <div className="flex justify-center items-center mb-4 rounded-full w-16 h-16 text-text-secondary glass">
          <LuMessageSquare size={32} />
        </div>
        <h3>Your Messages</h3>
        <p className="text-text-secondary">
          Select a chat to start messaging...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col flex-1 w-full h-full">
      <div className="z-(--z-raised) flex justify-between items-center px-4 glass-nav h-16">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onBack}
            className="md:hidden -m-2 p-0 pr-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <LuArrowLeft size={28} />
          </button>
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
          <div>
            <h6 className="font-medium text-text-primary truncate">
              {chat.name}
            </h6>
            <p className="text-status-success-text text-xs">
              {chat.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 text-text-secondary">
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary glass">
            <LuPhone size={20} />
          </button>
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary glass">
            <LuVideo size={20} />
          </button>
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary glass">
            <IoMdMore size={20} />
          </button>
        </div>
      </div>

      <div className="z-(--z-base) relative flex flex-col flex-1 p-4 pb-20 md:pb-4 overflow-y-auto">
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

      <div className="bottom-0 z-(--z-raised) md:static gap-2 md:gap-3 flex items-center absolute p-2 pb-1 glass-nav border-glass-border border-b-0 border-t border w-full">
        <button className="p-2.5 rounded-full h-max text-text-secondary hover:text-text-primary glass">
          <LuPaperclip size={20} />
        </button>

        <div className="w-full">
          <textarea
            rows={1}
            ref={textareaRef}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="[&::-webkit-scrollbar]:hidden mt-1 pl-4 h-auto [-ms-overflow-style:none] overflow-y-auto resize-none [scrollbar-width:none]"
          />
        </div>

        <button className="p-2.5 rounded-full h-max text-text-secondary hover:text-text-primary glass">
          <LuSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
