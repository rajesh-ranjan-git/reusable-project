import { LoggedInUserType } from "@/types/types/auth.types";
import {
  MessageDisplayType,
  MessageResponseType,
} from "@/types/types/message.types";
import { UserProfileType } from "@/types/types/profile.types";
import { formatTime } from "@/utils/date.utils";
import { getFullName } from "@/helpers/profile.helpers";

const getMessageSenderId = (sender: UserProfileType) => {
  if (typeof sender === "string") return sender;

  return sender.userId ?? "";
};

const getMessagePreview = (message: MessageResponseType) => {
  if (message.contentType === "deleted" || message.deletedAt) {
    return "This message was deleted";
  }

  if (message.contentType === "text") return message.content;

  return `[${message.contentType}]`;
};

export const getMessageDisplay = (
  message: MessageResponseType,
  loggedInUser: LoggedInUserType,
): MessageDisplayType => {
  const senderId = getMessageSenderId(message.sender);
  const isDeleted = message.isDeleted || message.contentType === "deleted";
  const deliveryStatus =
    message.deliveryStatus ??
    (message.receipts?.some((receipt) => receipt.seenAt)
      ? "seen"
      : message.receipts?.some((receipt) => receipt.deliveredAt)
        ? "delivered"
        : "sent");

  return {
    messageId:
      message.messageId ?? message.id ?? `${message.createdAt}-${senderId}`,
    content: getMessagePreview(message),
    contentType: message.contentType,
    time: formatTime(message.createdAt),
    senderName:
      senderId === loggedInUser?.userId ? "You" : getFullName(message.sender),
    isOwn: senderId === loggedInUser?.userId,
    isEdited: Boolean(message.isEdited || message.editHistory?.length),
    isDeleted,
    deliveryStatus,
    errorMessage: message.errorMessage,
  };
};
