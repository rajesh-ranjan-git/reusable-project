"use client";

import { useEffect, useRef, useState } from "react";
import { BATCH_SIZE, PREFETCH_AT } from "@/constants/common.constants";
import { SwipeDirectionType } from "@/types/types/discover.types";
import { ProfilesResponseType } from "@/types/types/response.types";
import { UserProfileType } from "@/types/types/profile.types";
import { fetchProfiles } from "@/lib/actions/discover.actions";
import Header from "@/components/layout/header";
import AppSidebar from "@/components/layout/app.sidebar";
import BottomNav from "@/components/layout/bottom.navbar";
import ActionBar from "@/components/discover/action.bar";
import SwipeCard from "@/components/discover/swipe.card";
import { connect } from "@/lib/actions/connection.actions";
import { useToast } from "@/hooks/toast";
import { toTitleCase } from "@/utils/common.utils";

const DiscoverPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleProfiles, setVisibleProfiles] = useState<UserProfileType[]>([]);
  const [bufferProfiles, setBufferProfiles] = useState<UserProfileType[]>([]);

  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);

  const { showToast } = useToast();

  const handleSwipe = async (
    direction: SwipeDirectionType,
    userId?: string,
  ) => {
    const targetId =
      userId ??
      (visibleProfiles.length > 0
        ? visibleProfiles[visibleProfiles.length - 1]?.userId
        : null);

    if (targetId) {
      setVisibleProfiles((prev) => prev.filter((p) => p?.userId !== targetId));
    }

    if (direction === "left") {
      const notInterestedResponse = await connect(targetId!, "not-interested");

      if (!notInterestedResponse.success) {
        showToast({
          title: toTitleCase(notInterestedResponse.code),
          message: notInterestedResponse.message ?? "",
          variant: "error",
        });
      }
    } else {
      const interestedResponse = await connect(targetId!, "interested");

      if (!interestedResponse.success) {
        showToast({
          title: toTitleCase(interestedResponse.code),
          message: interestedResponse.message ?? "",
          variant: "error",
        });
      }
    }
  };

  const loadProfiles = async (page: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await fetchProfiles(pageRef.current);

      if (response.success && response?.data) {
        const data = response?.data as ProfilesResponseType;
        if (bufferProfiles.length <= BATCH_SIZE) {
          setBufferProfiles((prev) => [...prev, ...data.users]);
          pageRef.current += 1;
        }
      }
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (bufferProfiles.length <= BATCH_SIZE) {
      loadProfiles(pageRef.current);
    }
  }, [bufferProfiles]);

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
    loadProfiles(pageRef.current);
  }, []);

  return (
    <div className="flex flex-col bg-bg-page h-dvh overflow-hidden text-text-primary">
      <Header
        type="default"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="relative flex flex-1 overflow-hidden">
        <div className="hidden xl:flex">
          <AppSidebar />
        </div>

        <div className="relative flex flex-col flex-1 justify-center items-center p-4 pb-20 md:pb-6 overflow-hidden">
          <div className="relative flex justify-center items-center w-full max-w-90 md:max-w-md h-137.5 md:h-150">
            {visibleProfiles.length === 0 ? (
              <div className="p-8 border w-full text-center glass">
                <div className="flex justify-center items-center mx-auto mb-4 border border-glass-border-accent rounded-full w-20 h-20 r">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="mb-2 font-bold text-text-primary text-xl">
                  You're all caught up!
                </h3>
                <p className="text-text-secondary text-sm">
                  We're looking for more developers in your area. Check back
                  later or expand your search distance.
                </p>
              </div>
            ) : (
              visibleProfiles.map((profile, index) => (
                <SwipeCard
                  key={profile?.userId}
                  profile={profile}
                  active={index === visibleProfiles.length - 1}
                  onSwipe={handleSwipe}
                />
              ))
            )}
          </div>

          {visibleProfiles.length > 0 && <ActionBar onSwipe={handleSwipe} />}
        </div>
      </main>

      <BottomNav activeTab="discover" />
    </div>
  );
};

export default DiscoverPage;
