"use client";

import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
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
import BioForm from "@/components/forms/bioForm";
import ExperienceForm from "@/components/forms/experienceForm";
import SkillsForm from "@/components/forms/skillsForm";
import InterestsForm from "@/components/forms/interestsForm";

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

type CurrentFormType = "bio" | "skills" | "interests" | "experience" | null;

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
  const [currentForm, setCurrentForm] = useState<CurrentFormType>(null);

  const accessToken = useAppStore((state) => state.accessToken);

  const getUserProfile = async (userName?: string) => {
    const response = await fetchProfile(userName);

    if (response.success && response?.data) {
      const data = response?.data as UserProfileResponseType;

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
            <ProfileHeader isOwnProfile={isOwnProfile} user={userProfile} />

            {userProfile?.bio ? (
              <div className="relative mb-6 p-6 leading-relaxed glass">
                <h3 className="mb-4 tracking-wider">Bio</h3>
                {toTitleCase(userProfile?.bio)}
                {userProfile?.bio.trim().split("\n").length > 0
                  ? userProfile?.bio
                      .trim()
                      .split("\n")
                      .map((bio, idx) => (
                        <p
                          key={`${bio.length}-${idx}`}
                          className="text-text-primary"
                        >
                          {toTitleCase(bio)}
                        </p>
                      ))
                  : toTitleCase(userProfile?.bio.trim())}

                {isOwnProfile ? (
                  <button
                    className="top-2 right-2 absolute px-2 text-sm btn btn-secondary"
                    onClick={() => setCurrentForm("bio")}
                  >
                    <MdOutlineEdit size={20} />
                  </button>
                ) : null}
              </div>
            ) : isOwnProfile ? (
              <div className="relative mb-6 p-6 leading-relaxed glass">
                <h3 className="mb-4 tracking-wider">Bio</h3>
                <p className="text-text-muted">Add bio to show here...</p>

                <button
                  className="top-2 right-2 absolute flex items-center gap-2 pl-3 text-sm btn btn-secondary"
                  onClick={() => setCurrentForm("bio")}
                >
                  <IoMdAdd size={20} />
                  <span className="hidden md:block">Add</span>
                </button>
              </div>
            ) : null}

            <BioForm
              isOpen={currentForm === "bio"}
              onClose={() => setCurrentForm(null)}
              initialData={userProfile?.bio ?? ""}
              onSave={(updatedBio) => {
                setUserProfile((prev) => {
                  if (!prev) return prev;

                  return {
                    ...prev,
                    bio: updatedBio,
                  };
                });
              }}
            />

            {userProfile?.experiences && userProfile.experiences.length > 0 ? (
              <ExperienceSection
                isOwnProfile={isOwnProfile}
                experiences={userProfile.experiences}
                setCurrentForm={setCurrentForm}
              />
            ) : isOwnProfile ? (
              <div className="relative mb-6 p-6 leading-relaxed glass">
                <h3 className="mb-4 tracking-wider">Work Experience</h3>
                <p className="text-text-muted">
                  Add your work experiences to show here...
                </p>

                <button
                  className="top-2 right-2 absolute flex items-center gap-2 pl-3 text-sm btn btn-secondary"
                  onClick={() => setCurrentForm("experience")}
                >
                  <IoMdAdd size={20} />
                  <span className="hidden md:block">Add</span>
                </button>
              </div>
            ) : null}

            <ExperienceForm
              isOpen={currentForm === "experience"}
              onClose={() => setCurrentForm(null)}
              initialData={userProfile?.experiences ?? []}
              onSave={() => {}}
            />

            {userProfile?.skills?.length && userProfile.skills.length > 0 ? (
              <TechStack
                isOwnProfile={isOwnProfile}
                skills={userProfile?.skills}
                setCurrentForm={setCurrentForm}
              />
            ) : isOwnProfile ? (
              <div className="relative mb-6 p-6 leading-relaxed glass">
                <h3 className="mb-4 tracking-wider">Tech Stack & Expertise</h3>
                <p className="text-text-muted">
                  Add your skills to show here...
                </p>

                <button
                  className="top-2 right-2 absolute flex items-center gap-2 pl-3 text-sm btn btn-secondary"
                  onClick={() => setCurrentForm("skills")}
                >
                  <IoMdAdd size={20} />
                  <span className="hidden md:block">Add</span>
                </button>
              </div>
            ) : null}

            <SkillsForm
              isOpen={currentForm === "skills"}
              onClose={() => setCurrentForm(null)}
              initialData={userProfile?.skills ?? []}
              onSave={() => {}}
            />

            {userProfile?.interests?.length ? (
              <Interests
                isOwnProfile={isOwnProfile}
                interests={userProfile?.interests}
                setCurrentForm={setCurrentForm}
              />
            ) : isOwnProfile ? (
              <div className="relative mb-6 p-6 leading-relaxed glass">
                <h3 className="mb-4 tracking-wider">Interests & Hobbies</h3>
                <p className="text-text-muted">
                  Add your interests and hobbies to show here...
                </p>

                <button
                  className="top-2 right-2 absolute flex items-center gap-2 pl-3 text-sm btn btn-secondary"
                  onClick={() => setCurrentForm("interests")}
                >
                  <IoMdAdd size={20} />
                  <span className="hidden md:block">Add</span>
                </button>
              </div>
            ) : null}

            <InterestsForm
              isOpen={currentForm === "interests"}
              onClose={() => setCurrentForm(null)}
              onSave={(updatedInterests) => {
                setUserProfile((prev) => {
                  if (!prev) return prev;

                  return {
                    ...prev,
                    interests: updatedInterests,
                  };
                });
              }}
              initialData={userProfile?.interests ?? []}
            />

            <ActivitySection
              isOwnProfile={isOwnProfile}
              activities={mockActivities}
            />
          </div>
        </div>
      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
