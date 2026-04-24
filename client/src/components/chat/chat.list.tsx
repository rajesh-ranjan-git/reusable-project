import Image from "next/image";
import { LuSearch } from "react-icons/lu";
import { staticImagesConfig } from "@/config/common.config";
import { ChatListProps } from "@/types/props/chat.props";
import { mockChats } from "@/lib/data/chat.data";
import FormInput from "@/components/forms/shared/form.input";

const ChatList = ({ selectedChatId, onSelectChat }: ChatListProps) => {
  return (
    <div className="flex flex-col bg-surface md:bg-transparent border-glass-border md:border-r w-full md:w-72 lg:w-80 h-full shrink-0">
      <div className="bg-glass-bg p-4 pb-2 border-glass-border border-b">
        <h4 className="mb-2 font-arima tracking-wider">Messages</h4>
        <div className="relative flex-1 max-w-md">
          <FormInput
            placeholder="Search messages..."
            startIcon={<LuSearch />}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {mockChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full text-left p-3 flex gap-2 items-center border-b border-glass-border duration-200 hover:bg-glass-bg-subtle ${selectedChatId === chat.id ? "bg-glass-bg-strong" : "bg-glass-bg"}`}
          >
            <div className="relative shrink-0">
              <Image
                src={staticImagesConfig.avatarPlaceholder.src}
                alt={staticImagesConfig.avatarPlaceholder.alt}
                width={100}
                height={100}
                className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
              />
              {chat.online ? (
                <span className="right-0 bottom-0 absolute bg-green-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
              ) : (
                <span className="right-0 bottom-0 absolute bg-gray-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
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
};

export default ChatList;
