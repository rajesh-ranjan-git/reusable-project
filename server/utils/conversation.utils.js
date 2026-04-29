import { sanitizeMongoData } from "../db/db.utils.js";
import { omitObjectProperties } from "./common.utils.js";

export const normalizeConversationParticipants = (conversation) => {
  conversation.participants = conversation.participants.map((participant) => {
    const user = participant.user || {};
    const account = user.account || {};
    const profile = user.profile || {};

    return {
      ...participant,
      user: {
        userId: user.id,
        status: user.status,
        lastSeen: user.lastSeen,
        email: account.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        fullName: profile.fullName,
        avatar: profile.avatar,
        currentJobRole: profile.currentJobRole,
      },
    };
  });

  return conversation;
};
