import { ApiErrorResponseType, ApiResponseType } from "@/types/types/api.types";
import { apiUrls } from "@/lib/api/apiUtils";
import { api } from "@/lib/api/apiHandler";

export const fetchProfiles = async (
  page: number,
  query?: string,
): Promise<ApiResponseType> => {
  try {
    return await api.get(`${apiUrls.discover.fetchProfiles}?page=${page}`, {
      requireAuth: true,
    });
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};
