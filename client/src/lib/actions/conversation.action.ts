import { ApiErrorResponseType, ApiResponseType } from "@/types/types/api.types";
import { api } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const fetchConversationsList = async (): Promise<ApiResponseType> => {
  try {
    return await api.get(apiUrls.conversation.actionConversations, {
      requireAuth: true,
    });
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
