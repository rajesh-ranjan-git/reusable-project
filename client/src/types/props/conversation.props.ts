import {
  ConversationType,
  MessageType,
} from "@/types/types/conversation.types";

export interface ConversationProps {
  params: {
    userName: string;
  };
}

export interface ConversationPageProps {
  userName?: string;
}

export interface ConversationListProps {
  selectedConversationId: number | null;
  onSelectConversation: (conversation: ConversationType) => void;
}

export interface ConversationWindowProps {
  conversation: ConversationType | null;
  onBack: () => void;
}

export interface MessageBubbleProps {
  message: MessageType;
  isOwn: boolean;
}
