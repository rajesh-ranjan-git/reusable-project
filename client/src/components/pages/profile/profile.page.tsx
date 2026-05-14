"use client";

import { useEffect } from "react";
import { ProfilePageProps } from "@/types/props/profile.props.types";
import { UserProfileType } from "@/types/types/profile.types";
import { useAppStore } from "@/store/store";
import { toTitleCase } from "@/utils/common.utils";
import { mockActivities } from "@/lib/data/profile.data";
import {
  useOwnProfileQuery,
  useUserProfileQuery,
  useUpdateProfileCache,
} from "@/lib/queries/profile.query";
import ProfileHeader from "@/components/profile/profile.header";
import Activity from "@/components/profile/activity";
import ProfileInterests from "@/components/profile/profile.interests";
import ProfileSkills from "@/components/profile/profile.skills";
import ProfileExperience from "@/components/profile/profile.experience";
import ProfileBio from "@/components/profile/profile.bio";
import ProfilePersonal from "@/components/profile/profile.personal";
import ProfileForms from "@/components/profile/profile.forms";

const ProfilePage = ({ userName }: ProfilePageProps) => {
  const isOwnProfile = !userName;

  const accessToken = useAppStore((state) => state.accessToken);
  const setLoggedInUser = useAppStore((state) => state.setLoggedInUser);
  const setCurrentForm = useAppStore((state) => state.setCurrentProfileForm);

  const updateProfileCache = useUpdateProfileCache();

  const ownQuery = useOwnProfileQuery(!userName && !!accessToken);
  const userQuery = useUserProfileQuery(userName, !!userName && !!accessToken);

  const userProfile = isOwnProfile ? ownQuery.data : userQuery.data;

  useEffect(() => {
    setCurrentForm(null);
  }, [userName, setCurrentForm]);

  const handleProfileSave = (updated: Partial<UserProfileType>) => {
    const updatedValues =
      updated.firstName && updated.lastName
        ? {
            ...updated,
            fullName: toTitleCase(`${updated.firstName} ${updated.lastName}`),
          }
        : updated.firstName
          ? { ...updated, fullName: toTitleCase(updated.firstName) }
          : updated;

    updateProfileCache(updatedValues, userName);

    const loggedInUserUpdates = {
      ...(updatedValues.email && { email: updatedValues.email }),
      ...(updatedValues.userName && { userName: updatedValues.userName }),
      ...(updatedValues.firstName && { firstName: updatedValues.firstName }),
      ...(updatedValues.lastName && { lastName: updatedValues.lastName }),
      ...(updatedValues.fullName && { fullName: updatedValues.fullName }),
    };

    setLoggedInUser((prev) =>
      prev ? { ...prev, ...loggedInUserUpdates } : prev,
    );
  };

  return (
    <div className="flex-1 bg-bg/50 overflow-y-auto">
      <div className="mx-auto p-4 md:p-8 pb-24 md:pb-8 max-w-7xl">
        <ProfileHeader
          userProfile={userProfile ?? null}
          isOwnProfile={isOwnProfile}
        />
        <ProfilePersonal
          userProfile={userProfile ?? null}
          isOwnProfile={isOwnProfile}
        />
        <ProfileBio bio={userProfile?.bio} isOwnProfile={isOwnProfile} />
        <ProfileExperience
          experiences={userProfile?.experiences}
          isOwnProfile={isOwnProfile}
        />
        <ProfileSkills
          skills={userProfile?.skills}
          isOwnProfile={isOwnProfile}
        />
        <ProfileInterests
          interests={userProfile?.interests}
          isOwnProfile={isOwnProfile}
        />
        <Activity isOwnProfile={isOwnProfile} activities={mockActivities} />
        <ProfileForms
          userProfile={userProfile ?? null}
          onSave={handleProfileSave}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
