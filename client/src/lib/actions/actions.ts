import { api, ApiErrorResponse, ApiResponse } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const refreshTokens = async (): Promise<ApiResponse> => {
  try {
    return await api.get(apiUrls.auth.refresh);
  } catch (error) {
    return error as ApiErrorResponse;
  }
};

export const fetchMe = async (token: string): Promise<ApiResponse> => {
  try {
    return await api.get(apiUrls.auth.me, { token });
  } catch (error) {
    return error as ApiErrorResponse;
  }
};
