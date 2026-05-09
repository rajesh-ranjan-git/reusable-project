import { LoggedInUserType } from "@/types/types/auth.types";
import { MessageResponseType } from "@/types/types/message.types";
import { UserProfileType } from "@/types/types/profile.types";
import {
  ConversationCallHistoryType,
  ConversationLastMessageType,
  ConversationParticipantType,
  ConversationType,
  GroupSettingsType,
} from "@/types/types/conversation.types";

export type ResponsePaginationType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchMeResponseType = {
  user: LoggedInUserType;
};

export type RefreshResponseType = {
  accessToken: string;
};

export type VerifyEmailResponseType = {
  email: string;
};

export type ProfileResponseType = {
  user: UserProfileType;
};

export type ProfilesResponseType = {
  users: UserProfileType[];
  pagination: ResponsePaginationType;
};

export type UploadImageResponseType = {
  id: string;
  avatar: string;
};

export interface ConversationResponseType {
  id: string;
  type: ConversationType;
  participants: ConversationParticipantType[];
  lastMessage: ConversationLastMessageType | null;
  lastActivityAt: string;
  pinnedMessages: string[];
  deletedAt: string | null;
  groupSettings: GroupSettingsType | null;
  callHistory: ConversationCallHistoryType[];
  createdAt: string;
  updatedAt: string;
  activeParticipantCount: number;
}

export type ConversationListResponseType = {
  conversations: ConversationResponseType[];
  pagination: ResponsePaginationType;
};

export type DirectConversationResponseType = {
  conversation: ConversationResponseType;
};

export type MessagesResponseType = {
  messages: MessageResponseType[];
  nextCursor: string | null;
};

export type MessageResponseDataType = {
  message: MessageResponseType;
};
