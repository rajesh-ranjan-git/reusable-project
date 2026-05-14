"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BATCH_SIZE, PREFETCH_AT } from "@/constants/common.constants";
import {
  ConnectMutationType,
  SwipeDirectionType,
} from "@/types/types/discover.types";
import { UserProfileType } from "@/types/types/profile.types";
import { useToast } from "@/hooks/toast";
import { toTitleCase } from "@/utils/common.utils";
import { connect } from "@/lib/actions/connection.actions";
import useDiscoverProfiles from "@/lib/queries/discover.query";
import { ApiError } from "@/lib/api/apiHandler";
import ActionBar from "@/components/discover/action.bar";
import SwipeCard from "@/components/discover/swipe.card";
import DiscoverShimmer from "@/components/ui/shimmers/discover.shimmer";
import DiscoverEmpty from "@/components/ui/empty/discover.empty";
import DiscoverError from "@/components/ui/errors/discover.error";

const DiscoverPage = () => {
  const [visibleProfiles, setVisibleProfiles] = useState<UserProfileType[]>([]);
  const [bufferProfiles, setBufferProfiles] = useState<UserProfileType[]>([]);

  const { showToast } = useToast();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, isError, error } =
    useDiscoverProfiles();

  const allProfiles = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.users) ?? [];
  }, [data]);

  const connectMutation = useMutation({
    mutationFn: async ({ targetId, direction }: ConnectMutationType) => {
      return await connect(
        targetId,
        direction === "left" ? "not-interested" : "interested",
      );
    },

    onMutate: async ({ targetId }) => {
      const removedProfile = visibleProfiles.find((p) => p.userId === targetId);

      setVisibleProfiles((prev) => prev.filter((p) => p.userId !== targetId));

      return { removedProfile };
    },

    onError: (error, _, context) => {
      if (context?.removedProfile) {
        setVisibleProfiles((prev) => [...prev, context.removedProfile!]);
      }

      showToast({
        title: toTitleCase(
          error instanceof ApiError ? error.code : "Connection Request Failed",
        ),
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while sending the request!",
        variant: "error",
      });
    },
  });

  useEffect(() => {
    if (!allProfiles.length) return;

    setBufferProfiles((prev) => {
      const existingIds = new Set(prev.map((p) => p.userId));

      const newProfiles = allProfiles.filter((p) => !existingIds.has(p.userId));

      return [...prev, ...newProfiles];
    });
  }, [allProfiles]);

  useEffect(() => {
    if (
      visibleProfiles.length <= PREFETCH_AT &&
      bufferProfiles.length >= BATCH_SIZE
    ) {
      const nextChunk = bufferProfiles.slice(0, BATCH_SIZE);

      setVisibleProfiles((prev) => [...nextChunk, ...prev]);

      setBufferProfiles((prev) => prev.slice(BATCH_SIZE));
    }
  }, [visibleProfiles, bufferProfiles]);

  useEffect(() => {
    if (bufferProfiles.length <= BATCH_SIZE && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [bufferProfiles, fetchNextPage, isFetchingNextPage]);

  const handleSwipe = (direction: SwipeDirectionType, userId?: string) => {
    const targetId =
      userId ?? visibleProfiles[visibleProfiles.length - 1]?.userId;

    if (!targetId) return;

    connectMutation.mutate({
      targetId,
      direction,
    });
  };

  const renderDiscoverContent = () => {
    if (isLoading) {
      return <DiscoverShimmer />;
    }

    if (isError || error) {
      return <DiscoverError error={error} />;
    }

    if (visibleProfiles.length === 0) {
      return <DiscoverEmpty />;
    }

    return visibleProfiles.map((profile, index) => (
      <SwipeCard
        key={profile.userId}
        profile={profile}
        active={index === visibleProfiles.length - 1}
        onSwipe={handleSwipe}
      />
    ));
  };

  return (
    <div className="relative flex flex-col flex-1 justify-center items-center p-4 pb-20 md:pb-6 overflow-hidden">
      <div className="relative flex justify-center items-center w-full max-w-90 md:max-w-md h-137.5 md:h-150">
        {renderDiscoverContent()}
      </div>

      {!error && (
        <ActionBar onSwipe={handleSwipe} loadingProfiles={isLoading} />
      )}
    </div>
  );
};

export default DiscoverPage;
