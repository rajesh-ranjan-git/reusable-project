"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/store";
import { toTitleCase } from "@/utils/common.utils";
import { fetchProfile } from "@/lib/actions/profileActions";
import Header from "@/components/layout/header";
import AppSidebar from "@/components/layout/appSidebar";
import BottomNav from "@/components/layout/bottomNav";
import ProfileHeader from "@/components/profile/profileHeader";
import TechStack from "@/components/profile/techStack";
import Interests from "@/components/profile/interests";
import ActivitySection from "@/components/profile/activitySection";
import ExperienceSection from "@/components/profile/experienceSection";

interface ProfilePageProps {
  userName?: string;
}

type UserProfileResponseType = {
  user: UserProfileType;
};

type Skill = {
  name: string;
  level: string;
  icon?: string;
};

type Social = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
} | null;

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
} | null;

type UserProfileType = {
  id: string;
  email: string;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  nickName: string | null;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  location: string | null;
  skills: Skill[] | null;
  interests: string[] | null;
  social: Social;
  experiences: Experience[] | null;
  createdAt: string;
  updatedAt: string | null;
} | null;

const mockActivities = [
  {
    type: "commit",
    date: "Today, 2:40 PM",
    title: "Pushed 12 commits to devmatch/ui-core",
    description:
      "Refactored glassmorphism utilities and implemented the new Profile Dashboard view.",
  },
  {
    type: "pr",
    date: "Yesterday",
    title: "Merged PR #84: Auth Authentication Flow",
    description:
      "Replaces generic login with NextAuth OAuth integrations for Google & GitHub.",
  },
  {
    type: "hackathon",
    date: "Mar 15, 2024",
    title: "Won 1st Place at Web3 Builders Hackathon",
    description: "Built a decentralized talent matching smart contract system.",
  },
  {
    type: "star",
    date: "Mar 10, 2024",
    title: "Starred facebook/react",
    description: "",
  },
];

const ProfilePage = ({ userName }: ProfilePageProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType>(null);
  const [isOwnProfile] = useState<boolean>(!userName);

  const accessToken = useAppStore((state) => state.accessToken);

  const getUserProfile = async (userName?: string) => {
    if (userName) {
      const response = await fetchProfile(accessToken!, userName);

      if (response.success && response?.data) {
        const data = response?.data as UserProfileResponseType;

        setUserProfile(data.user);
      } else {
        setUserProfile(null);
      }
    } else {
      const response = await fetchProfile(accessToken!);

      if (response.success && response.data) {
        const data = response?.data as UserProfileResponseType;

        setUserProfile(data.user);
      } else {
        setUserProfile(null);
      }
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
            <ProfileHeader isOwnProfile={isOwnProfile} user={userProfile} />

            {userProfile?.bio && (
              <div className="mb-6 p-6 leading-relaxed glass">
                <h3 className="mb-4 tracking-wider">About Me</h3>
                {toTitleCase(userProfile?.bio)}
              </div>
            )}

            {userProfile?.experiences && userProfile.experiences.length > 0 && (
              <ExperienceSection experiences={userProfile.experiences} />
            )}

            {userProfile?.skills?.length && userProfile.skills.length > 0 ? (
              <TechStack skills={userProfile?.skills} />
            ) : null}

            {userProfile?.location?.length &&
              userProfile.location.length > 0 && (
                <Interests interests={userProfile?.interests} />
              )}

            <ActivitySection activities={mockActivities} />
          </div>
        </div>
      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
