"use client";

import { useEffect, useState } from "react";
import { ProfilePageProps } from "@/types/props/profile.props.types";
import { CurrentFormType, UserProfileType } from "@/types/types/profile.types";
import { ProfileResponseType } from "@/types/types/response.types";
import { useAppStore } from "@/store/store";
import { fetchProfile } from "@/lib/actions/profile.actions";
import { mockActivities } from "@/lib/data/profile.data";
import Header from "@/components/layout/header";
import AppSidebar from "@/components/layout/app.sidebar";
import BottomNav from "@/components/layout/bottom.navbar";
import ProfileHeader from "@/components/profile/profile.header";
import Activity from "@/components/profile/activity";
import ProfileInterests from "@/components/profile/profile.interests";
import ProfileSkills from "@/components/profile/profile.skills";
import ProfileExperience from "@/components/profile/profile.experience";
import ProfileBio from "@/components/profile/profile.bio";
import ProfilePersonal from "@/components/profile/profile.personal";

const ProfilePage = ({ userName }: ProfilePageProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isOwnProfile] = useState<boolean>(!userName);
  const [currentForm, setCurrentForm] = useState<CurrentFormType>(null);

  const accessToken = useAppStore((state) => state.accessToken);

  const getUserProfile = async (userName?: string) => {
    const response = await fetchProfile(userName);

    if (response.success && response?.data) {
      const data = response?.data as ProfileResponseType;

      setUserProfile(data.user);
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getUserProfile(userName);
    }
  }, [userName, accessToken]);

  return (
    <div className="flex flex-col bg-bg h-dvh overflow-hidden text-text-primary">
      <Header
        type="default"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="relative flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <AppSidebar />
        </div>

        <div className="flex-1 bg-bg/50 overflow-y-auto">
          <div className="mx-auto p-4 md:p-8 pb-24 md:pb-8 max-w-7xl">
            <ProfileHeader
              isOwnProfile={isOwnProfile}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              currentForm={currentForm}
              setCurrentForm={setCurrentForm}
            />

            <ProfilePersonal
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              isOwnProfile={isOwnProfile}
              currentForm={currentForm}
              setCurrentForm={setCurrentForm}
            />

            <ProfileBio
              bio={userProfile?.bio}
              isOwnProfile={isOwnProfile}
              setUserProfile={setUserProfile}
              currentForm={currentForm}
              setCurrentForm={setCurrentForm}
            />

            <ProfileExperience
              experiences={userProfile?.experiences}
              isOwnProfile={isOwnProfile}
              setUserProfile={setUserProfile}
              currentForm={currentForm}
              setCurrentForm={setCurrentForm}
            />

            <ProfileSkills
              skills={userProfile?.skills}
              isOwnProfile={isOwnProfile}
              setUserProfile={setUserProfile}
              currentForm={currentForm}
              setCurrentForm={setCurrentForm}
            />

            <ProfileInterests
              interests={userProfile?.interests}
              isOwnProfile={isOwnProfile}
              setUserProfile={setUserProfile}
              currentForm={currentForm}
              setCurrentForm={setCurrentForm}
            />

            <Activity isOwnProfile={isOwnProfile} activities={mockActivities} />
          </div>
        </div>
      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
