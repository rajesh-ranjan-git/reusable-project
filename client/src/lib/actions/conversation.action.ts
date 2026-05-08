import { ApiErrorResponseType, ApiResponseType } from "@/types/types/api.types";
import { api } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const fetchConversationsList = async (
  page: number = 1,
): Promise<ApiResponseType> => {
  try {
    return await api.get(
      `${apiUrls.conversation.actionConversations}?page=${page}`,
      {
        requireAuth: true,
      },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const fetchDirectConversation = async (
  userName: string,
): Promise<ApiResponseType> => {
  try {
    return await api.post(
      `${apiUrls.conversation.directConversation}/${userName}`,
      {},
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const fetchConversationMessages = async (
  conversationId: string,
  cursor?: string | null,
): Promise<ApiResponseType> => {
  try {
    const params = new URLSearchParams();
    params.set("limit", "20");

    if (cursor) {
      params.set("cursor", cursor);
    }

    const query = params.toString();

    return await api.get(
      `${apiUrls.conversation.actionMessage}/${conversationId}/messages${query ? `?${query}` : ""}`,
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const sendConversationMessage = async (
  conversationId: string,
  content: string,
): Promise<ApiResponseType> => {
  try {
    return await api.post(
      `${apiUrls.conversation.actionMessage}/${conversationId}/message`,
      {
        conversationId,
        contentType: "text",
        content,
      },
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const markConversationAsRead = async (
  conversationId: string,
): Promise<ApiResponseType> => {
  try {
    return await api.patch(
      `${apiUrls.conversation.actionConversations}/${conversationId}/read`,
      {},
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const markMessageDelivered = async (
  conversationId: string,
  messageId: string,
): Promise<ApiResponseType> => {
  try {
    return await api.patch(
      `${apiUrls.conversation.actionMessage}/${conversationId}/messages/${messageId}/delivered`,
      {},
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const markMessageSeen = async (
  conversationId: string,
  messageId: string,
): Promise<ApiResponseType> => {
  try {
    return await api.patch(
      `${apiUrls.conversation.actionMessage}/${conversationId}/messages/${messageId}/seen`,
      {},
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};
