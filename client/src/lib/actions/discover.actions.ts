import { ApiSuccessResponseType } from "@/types/types/api.types";
import { apiUrls } from "@/lib/api/apiUtils";
import { api } from "@/lib/api/apiHandler";
import { ProfilesResponseType } from "@/types/types/response.types";

export const fetchProfiles = async (
  page: number,
  search?: string,
): Promise<ApiSuccessResponseType<ProfilesResponseType>> => {
  const params = new URLSearchParams({ page: String(page) });
  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    params.set("search", normalizedSearch);
  }

  return await api.get(`${apiUrls.discover.fetchProfiles}?${params}`, {
    requireAuth: true,
  });
};
