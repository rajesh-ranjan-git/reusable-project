"use client";

import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { ProfilePageProps } from "@/types/props/profile.props.types";
import { CurrentFormType, UserProfileType } from "@/types/types/profile.types";
import { UserProfileResponseType } from "@/types/types/response.types";
import { useAppStore } from "@/store/store";
import { toTitleCase } from "@/utils/common.utils";
import { fetchProfile } from "@/lib/actions/profile.actions";
import { mockActivities } from "@/lib/data/profile.data";
import Header from "@/components/layout/header";
import AppSidebar from "@/components/layout/app.sidebar";
import BottomNav from "@/components/layout/bottom.navbar";
import ProfileHeader from "@/components/profile/profile.header";
import TechStack from "@/components/profile/skills";
import Interests from "@/components/profile/interests";
import Activity from "@/components/profile/activity";
import Experience from "@/components/profile/experience";
import BioForm from "@/components/forms/profile/bio.form";
import ExperienceForm from "@/components/forms/profile/experience.form";
import SkillsForm from "@/components/forms/profile/skills.form";
import InterestsForm from "@/components/forms/profile/interests.form";

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
              <Experience
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
              onSave={(updatedSkills) => {
                setUserProfile((prev) => {
                  if (!prev) return prev;

                  return {
                    ...prev,
                    skills: updatedSkills,
                  };
                });
              }}
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

            <Activity isOwnProfile={isOwnProfile} activities={mockActivities} />
          </div>
        </div>
      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
