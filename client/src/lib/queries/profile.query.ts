import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME } from "@/constants/common.constants";
import { ProfileResponseType } from "@/types/types/response.types";
import { UserProfileType } from "@/types/types/profile.types";
import { fetchProfile } from "@/lib/actions/profile.actions";

export const profileKeys = {
  all: ["profile"] as const,
  own: () => [...profileKeys.all, "own"] as const,
  byUserName: (userName: string) =>
    [...profileKeys.all, "user", userName] as const,
};

export const useOwnProfileQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: profileKeys.own(),
    queryFn: async () => {
      const res = await fetchProfile();
      if (!res.success || !res.data) throw new Error("Failed to fetch profile");
      return (res.data as ProfileResponseType).user;
    },
    enabled,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const useUserProfileQuery = (
  userName: string | undefined,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: profileKeys.byUserName(userName!),
    queryFn: async () => {
      const res = await fetchProfile(userName);
      if (!res.success || !res.data) throw new Error("Failed to fetch profile");
      return (res.data as ProfileResponseType).user;
    },
    enabled: enabled && !!userName,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const useUpdateProfileCache = () => {
  const queryClient = useQueryClient();

  return (updates: Partial<UserProfileType>, userName?: string) => {
    const key = userName ? profileKeys.byUserName(userName) : profileKeys.own();

    queryClient.setQueryData<UserProfileType>(key, (prev) =>
      prev ? { ...prev, ...updates } : prev,
    );
  };
};
