import { SkillLevelType } from "@/types/types/profile.types";
import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export const allowedImageTypesConfig = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const emptyExperienceConfig = {
  company: "",
  role: "",
  startDate: "",
  endDate: null,
  isCurrent: false,
  description: "",
};

export const allowedSkillLevelsConfig = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

export const skillLevelPriorityConfig: Record<SkillLevelType, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

export const skillLevelMetaConfig: Record<
  SkillLevelType,
  { label: string; badgeClass: string }
> = {
  expert: { label: "Expert", badgeClass: "badge badge-gradient" },
  advanced: { label: "Advanced", badgeClass: "badge badge-purple" },
  intermediate: { label: "Intermediate", badgeClass: "badge badge-blue" },
  beginner: { label: "Beginner", badgeClass: "badge glass" },
};

export const socialPlatformsConfig = [
  {
    name: "facebook",
    Icon: FaFacebook,
    label: "Facebook",
    regex:
      /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]+)(?:\/)?/im,
  },
  {
    name: "instagram",
    Icon: FaInstagram,
    label: "Instagram",
    regex:
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/i,
  },
  {
    name: "twitter",
    Icon: FaTwitter,
    label: "Twitter / X",
    regex:
      /https?:\/\/(?:www\.|m\.)?(?:twitter|x)\.com\/@?([a-zA-Z0-9_]{1,15})(?:\/?|\?[^\s\/]*|\/[^\s\/]*)$/i,
  },
  {
    name: "github",
    Icon: FaGithub,
    label: "GitHub",
    regex: /^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/?$/,
  },
  {
    name: "linkedin",
    Icon: FaLinkedin,
    label: "LinkedIn",
    regex:
      /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/(mwlite\/|m\/)?in\/([a-zA-Z0-9À-ž_.-]+)\/?$/,
  },
  {
    name: "youtube",
    Icon: FaYoutube,
    label: "Youtube",
    regex:
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:channel\/|user\/|c\/|@)?([\w-]+)/,
  },
  {
    name: "website",
    Icon: FaGlobe,
    label: "Youtube",
    regex:
      /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d+)?(\/[^\s]*)?$/,
  },
];

export const propertyConstraintsConfig = {
  minUserNameLength: 6,
  maxUserNameLength: 100,
  minNameLength: 2,
  maxNameLength: 100,
  minPasswordLength: 6,
  maxPasswordLength: 100,
  minStringLength: 2,
  maxBioLength: 300,
  minBioLength: 2,
  maxStringLength: 100,
  phoneLength: 10,
  pinCodeLength: 6,
};
