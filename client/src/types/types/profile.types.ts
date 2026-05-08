import { ReactNode } from "react";
import { IconType } from "react-icons";
import { allowedSkillLevelsConfig } from "@/config/profile.config";
import {
  ConnectionDirectionType,
  ConnectionStatusType,
} from "@/types/types/connection.types";

export type ProfileActionButtonType = {
  label?: string;
  ariaLabel: string;
  icon: IconType;
  className: string;
  wrapperClassName?: string;
  action:
    | "accept"
    | "reject"
    | "connect"
    | "cancel"
    | "remove"
    | "unblock"
    | "message"
    | "more";
};

export type CurrentFormType =
  | "basic"
  | "username"
  | "social"
  | "email"
  | "verifyEmail"
  | "dob"
  | "gender"
  | "phone"
  | "maritalStatus"
  | "bio"
  | "skills"
  | "interests"
  | "experience"
  | null;

type PersonalFormKeyType = Exclude<
  CurrentFormType,
  "bio" | "skills" | "interests" | "experience" | null
>;

export type PersonalDetailType = {
  key: PersonalFormKeyType;
  label: string;
  value?: ReactNode;
  emptyText: string;
  icon: IconType;
  isVerified?: boolean;
  canVerify?: boolean;
};

export type HighlightedInterestType = {
  index: number;
};

export type SkillLevelType = (typeof allowedSkillLevelsConfig)[number];

export type SkillType = {
  name: string;
  level: string;
  icon?: string;
};

export type SkillErrorType = { index: number; name?: string; level?: string };

export type HighlightedSkillType = {
  index: number;
  type: string;
};

export type ExperienceType = {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
};

export type SocialType = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
};

export type ActivityType = {
  type: string;
  date: string;
  title: string;
  description: string;
};

export type ImageTargetType = "cover" | "avatar" | null;

export type UserProfileType = {
  userId: string;
  status?: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  userName: string;
  firstName?: string | null;
  lastName?: string | null;
  nickName?: string | null;
  fullName?: string | null;
  avatar?: string | null;
  cover?: string | null;
  bio?: string | null;
  dob?: string | null;
  age?: number | null;
  gender?: string | null;
  maritalStatus?: string | null;
  phone?: string | null;
  location?: string | null;
  skills?: SkillType[];
  topSkills?: SkillType[];
  interests?: string[] | null;
  social?: SocialType;
  experiences?: ExperienceType[] | null;
  totalExperience?: string | null;
  currentJobRole?: string | null;
  connectionStatus?: ConnectionStatusType;
  connectionDirection?: ConnectionDirectionType;
  lastSeen?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};
