import { allowedSkillLevelsConfig } from "@/config/profile.config";

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
  website?: string;
};

export type ActivityType = {
  type: string;
  date: string;
  title: string;
  description: string;
};

export type CurrentFormType =
  | "bio"
  | "skills"
  | "interests"
  | "experience"
  | null;

export type ImageTargetType = "cover" | "avatar" | null;

export type UserProfileType = {
  userId: string;
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
  phone?: number | null;
  location?: string | null;
  skills?: SkillType[];
  topSkills?: SkillType[];
  interests?: string[] | null;
  social?: SocialType;
  experiences?: ExperienceType[] | null;
  totalExperience?: string | null;
  currentJobRole?: string | null;
  lastSeen?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};
