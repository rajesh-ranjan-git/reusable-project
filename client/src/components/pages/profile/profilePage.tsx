"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/appSidebar";
import BottomNav from "@/components/layout/bottomNav";
import ActivitySection from "@/components/profile/activitySection";
import ProfileHeader from "@/components/profile/profileHeader";
import TechStack from "@/components/profile/techStack";
import Header from "@/components/layout/header";
import { fetchProfile } from "@/lib/actions/profileActions";
import { useAppStore } from "@/store/store";
import { toTitleCase } from "@/utils/common.utils";
import Interests from "@/components/profile/interests";

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

type UserProfileType = {
  id: string;
  email: string;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  location: string | null;
  skills: Skill[] | null;
  interests: string[] | null;
  social: Social;
  createdAt: string;
  updatedAt: string | null;
} | null;

type User = {
  name: string;
  headline: string;
  location: string;
  website: string;
  joinedDate: string;
  cover: string;
  avatar: string;
  online: boolean;
};

const mockUser: User = {
  name: "Alex Merced",
  headline: "Senior Full Stack Developer specializing in React & Node.js",
  location: "San Francisco, CA",
  website: "https://alexmerced.dev",
  joinedDate: "September 2023",
  cover:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80",
  avatar: "https://i.pravatar.cc/150?u=devmatch",
  online: true,
};

const mockSkills: Skill[] = [
  {
    name: "React",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "TypeScript",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "Node.js",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Tailwind CSS",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "PostgreSQL",
    level: "Intermediate",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "Figma",
    level: "Intermediate",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
];

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
          <div className="mx-auto p-4 md:p-8 pb-24 md:pb-8 max-w-200">
            <ProfileHeader isOwnProfile={isOwnProfile} user={userProfile} />

            {userProfile?.bio && (
              <div className="mb-6 p-6 leading-relaxed glass">
                <h3 className="mb-4 tracking-wider">About Me</h3>
                {toTitleCase(userProfile?.bio)}
              </div>
            )}

            {userProfile?.skills?.length && (
              <TechStack skills={userProfile?.skills} />
            )}

            {userProfile?.location?.length && (
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
