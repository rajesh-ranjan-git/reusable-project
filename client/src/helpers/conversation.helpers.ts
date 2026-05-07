import { staticImagesConfig } from "@/config/common.config";
import { ConversationDisplayType } from "@/types/types/conversation.types";
import { LoggedInUserType } from "@/types/types/auth.types";
import { ConversationResponseType } from "@/types/types/response.types";
import { formatTime } from "@/utils/date.utils";
import { getFullName } from "@/helpers/profile.helpers";

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
    : fallbackParticipant?.user.status === "active";

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
      : isOnline
        ? "Online"
        : "Offline",
    otherParticipants,
  };
};

export const getAvatarFallback = (title: string) => getInitials(title) || "U";
