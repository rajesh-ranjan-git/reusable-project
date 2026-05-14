"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME } from "@/constants/common.constants";
import { fetchProfiles } from "@/lib/actions/discover.actions";
import {
  ApiErrorResponseType,
  ApiSuccessResponseType,
} from "@/types/types/api.types";
import { ProfilesResponseType } from "@/types/types/response.types";

const DISCOVER_QUERY_KEYS = {
  profiles: ["discover-profiles"],
};

const useDiscoverProfiles = () => {
  return useInfiniteQuery<
    ApiSuccessResponseType<ProfilesResponseType>,
    ApiErrorResponseType,
    InfiniteData<ApiSuccessResponseType<ProfilesResponseType>>,
    string[],
    number
  >({
    queryKey: DISCOVER_QUERY_KEYS.profiles,

    initialPageParam: 1,

    queryFn: ({ pageParam }) => fetchProfiles(pageParam),

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },

    staleTime: DEFAULT_STALE_TIME,
  });
};

export default useDiscoverProfiles;
