import { ApiErrorResponseType, ApiResponseType } from "@/types/types/api.types";
import { api } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const refreshTokens = async (): Promise<ApiResponseType> => {
  try {
    return await api.post(apiUrls.auth.refresh);
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const fetchMe = async (token: string): Promise<ApiResponseType> => {
  try {
    return await api.get(apiUrls.auth.fetchMe, { token, requireAuth: true });
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};
