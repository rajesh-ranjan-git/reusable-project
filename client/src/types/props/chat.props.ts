import { ChatType, MessageType } from "@/types/types/chat.types";

export interface ChatListProps {
  selectedChatId: number | null;
  onSelectChat: (chat: ChatType) => void;
}

export interface ChatWindowProps {
  chat: ChatType | null;
  onBack: () => void;
}

export interface MessageBubbleProps {
  message: MessageType;
  isOwn: boolean;
}
