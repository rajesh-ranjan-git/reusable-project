import { ConversationDisplayType } from "@/types/types/conversation.types";

export const getConversationUniqueKey = (
  conversation: ConversationDisplayType,
  currentUserId?: string,
) => {
  if (conversation.conversation.type !== "direct") return conversation.id;

  const otherParticipantIds = conversation.conversation.participants
    .map((participant) => participant.user.userId)
    .filter((userId) => userId && userId !== currentUserId)
    .sort();

  return otherParticipantIds.length > 0
    ? `direct:${otherParticipantIds.join("|")}`
    : conversation.id;
};

export const normalizeConversationList = (
  conversations: ConversationDisplayType[],
  currentUserId?: string,
) => {
  const conversationMap = new Map<string, ConversationDisplayType>();

  conversations.forEach((conversation) => {
    const key = getConversationUniqueKey(conversation, currentUserId);
    const existingConversation = conversationMap.get(key);

    if (!existingConversation) {
      conversationMap.set(key, conversation);
      return;
    }

    const existingTime = new Date(
      existingConversation.conversation.lastMessage?.sentAt ??
        existingConversation.conversation.updatedAt,
    ).getTime();
    const nextTime = new Date(
      conversation.conversation.lastMessage?.sentAt ??
        conversation.conversation.updatedAt,
    ).getTime();

    if (nextTime >= existingTime) {
      conversationMap.set(key, conversation);
    }
  });

  return [...conversationMap.values()];
};
