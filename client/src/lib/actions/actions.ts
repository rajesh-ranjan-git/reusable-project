import { api, ApiErrorResponse, ApiResponse } from "@/lib/api/apiHandler";

export const testAction = async (): Promise<ApiResponse> => {
  try {
    const result = await api.get("/");

    return result;
  } catch (error) {
    logger.error("Error from testAction:", error);

    return error as ApiErrorResponse;
  }
};
