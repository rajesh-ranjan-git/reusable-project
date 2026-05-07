import { Dispatch, RefObject, SetStateAction } from "react";
import { ConversationResponseType } from "@/types/types/response.types";
import { ConversationDisplayType } from "@/types/types/conversation.types";
import {
  MessageDisplayType,
  MessageResponseType,
} from "@/types/types/message.types";

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
  shouldAutoScrollRef: RefObject<boolean>;
  isLoadingMessages: boolean;
  isLoadingOlderMessages: boolean;
  hasOlderMessages: boolean;
  displayMessages: MessageDisplayType[];
  messages: MessageResponseType[];
  isSending: boolean;
  onLoadOlderMessages: () => void;
  setNewMessagesCount: Dispatch<SetStateAction<number>>;
  persistAndEmitMessage: (
    clientMessageId: string,
    content: string,
  ) => Promise<void>;
}

export interface ConversationFooterProps {
  conversationId?: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  shouldAutoScrollRef: RefObject<boolean>;
  isSending: boolean;
  updateConversationWithMessage: (
    message: MessageResponseType,
    options?: {
      activeConversationId?: string | null;
      incrementUnread?: boolean;
    },
  ) => void;
  upsertMessage: (message: MessageResponseType) => void;
  persistAndEmitMessage: (
    clientMessageId: string,
    content: string,
  ) => Promise<void>;
}

export interface NewMessagesButtonProps {
  newMessagesCount: number;
  shouldAutoScrollRef: RefObject<boolean>;
  setNewMessagesCount: Dispatch<SetStateAction<number>>;
  scrollMessagesToBottom: (behavior?: ScrollBehavior) => void;
}
