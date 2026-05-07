import { ApiErrorResponseType, ApiResponseType } from "@/types/types/api.types";
import { apiUrls } from "@/lib/api/apiUtils";
import { api } from "@/lib/api/apiHandler";

export const fetchProfiles = async (
  page: number,
  search?: string,
): Promise<ApiResponseType> => {
  try {
    const params = new URLSearchParams({ page: String(page) });
    const normalizedSearch = search?.trim();

    if (normalizedSearch) {
      params.set("search", normalizedSearch);
    }

    return await api.get(`${apiUrls.discover.fetchProfiles}?${params}`, {
      requireAuth: true,
    });
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};
