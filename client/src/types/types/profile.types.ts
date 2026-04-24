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
  skills: SkillType[];
  interests: string[] | null;
  social: SocialType;
  experiences: ExperienceType[] | null;
  createdAt: string;
  updatedAt: string | null;
} | null;
