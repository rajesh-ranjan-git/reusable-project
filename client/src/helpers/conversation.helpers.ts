import { staticImagesConfig } from "@/config/common.config";
import { ConversationDisplayType } from "@/types/types/conversation.types";
import { LoggedInUserType } from "@/types/types/auth.types";
import { ConversationResponseType } from "@/types/types/response.types";
import { formatTime } from "@/utils/date.utils";
import {
  getFullName,
  getPresenceLabel,
  isUserOnline,
} from "@/helpers/profile.helpers";

const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const getConversationDisplay = (
  conversation: ConversationResponseType,
  loggedInUser: LoggedInUserType,
  onlineUserIds?: string[] | null,
): ConversationDisplayType => {
  const currentUserId = loggedInUser?.userId;
  const otherParticipants = conversation.participants.filter(
    (participant) => participant.user.userId !== currentUserId,
  );
  const currentParticipant = conversation.participants.find(
    (participant) => participant.user.userId === currentUserId,
  );

  const fallbackParticipant =
    otherParticipants[0] ?? conversation.participants[0] ?? null;
  const isGroup = conversation.type !== "direct";
  const groupName = conversation.groupSettings?.groupName;
  const title = isGroup
    ? groupName || `${conversation.activeParticipantCount} members`
    : getFullName(fallbackParticipant?.user) || "Unknown user";

  const subtitle =
    conversation.lastMessage?.content ||
    (isGroup
      ? otherParticipants
          .map((participant) => getFullName(participant.user))
          .join(", ")
      : fallbackParticipant?.user.currentJobRole) ||
    "No messages yet";

  const isOnline = isGroup
    ? conversation.activeParticipantCount > 1
    : isUserOnline(fallbackParticipant?.user, onlineUserIds);

  return {
    conversation,
    id: conversation.id,
    title,
    subtitle,
    avatar:
      (isGroup
        ? conversation.groupSettings?.groupAvatar
        : fallbackParticipant?.user.avatar) ||
      staticImagesConfig.avatarPlaceholder.src,
    isOnline,
    lastActivity: formatTime(
      conversation.lastMessage?.sentAt ?? conversation.updatedAt,
    ),
    unreadCount: currentParticipant?.unreadCount ?? 0,
    participantsLabel: isGroup
      ? `${conversation.activeParticipantCount} members`
      : getPresenceLabel(fallbackParticipant?.user, onlineUserIds),
    otherParticipants,
  };
};

export const getAvatarFallback = (title: string) => getInitials(title) || "U";

export const applyPresenceToConversationDisplay = (
  conversationDisplay: ConversationDisplayType,
  currentUserId?: string,
  onlineUserIds?: string[] | null,
): ConversationDisplayType => {
  if (conversationDisplay.conversation.type !== "direct") {
    return conversationDisplay;
  }

  const fallbackParticipant =
    conversationDisplay.otherParticipants[0] ??
    conversationDisplay.conversation.participants.find(
      (participant) => participant.user.userId !== currentUserId,
    ) ??
    null;
  const isOnline = isUserOnline(fallbackParticipant?.user, onlineUserIds);
  const lastSeen = isOnline ? null : (fallbackParticipant?.user.lastSeen ?? "");

  return {
    ...conversationDisplay,
    isOnline,
    participantsLabel: getPresenceLabel(fallbackParticipant?.user, onlineUserIds),
    otherParticipants: conversationDisplay.otherParticipants.map(
      (participant) =>
        participant.user.userId === fallbackParticipant?.user.userId
          ? {
              ...participant,
              user: {
                ...participant.user,
                lastSeen,
              },
            }
          : participant,
    ),
    conversation: {
      ...conversationDisplay.conversation,
      participants: conversationDisplay.conversation.participants.map(
        (participant) =>
          participant.user.userId === fallbackParticipant?.user.userId
            ? {
                ...participant,
                user: {
                  ...participant.user,
                  lastSeen,
                },
              }
            : participant,
      ),
    },
  };
};
