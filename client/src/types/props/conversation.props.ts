import { KeyboardEvent, RefObject } from "react";
import { ConversationResponseType } from "@/types/types/response.types";
import { ConversationDisplayType } from "@/types/types/conversation.types";
import { MessageDisplayType } from "@/types/types/message.types";

export interface ConversationProps {
  params: {
    userName: string;
  };
}

export interface ConversationPageProps {
  userName?: string;
}

export interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversation: ConversationResponseType) => void;
}

export interface ConversationWindowProps {
  conversation: ConversationResponseType | null;
  onBack: () => void;
}

export interface ConversationHeaderProps {
  onBack: () => void;
  conversationDisplay: ConversationDisplayType | null;
}

export interface MessagesContainerProps {
  messagesContainerRef: RefObject<HTMLDivElement | null>;
  handleMessagesScroll: () => void;
  isLoadingMessages: boolean;
  displayMessages: MessageDisplayType[];
  handleResend: (messageId: string) => void;
}

export interface ConversationFooterProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  handleInput: () => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  isSending: boolean;
  handleSend: () => void;
  draft: string;
}
