import { MdEmail, MdHeartBroken } from "react-icons/md";
import {
  LuAtSign,
  LuCheck,
  LuClock,
  LuMessageCircle,
  LuShare2,
  LuUser,
  LuUserMinus,
  LuUserPlus,
  LuX,
} from "react-icons/lu";
import {
  FaBirthdayCake,
  FaFemale,
  FaHeart,
  FaMale,
  FaPeopleArrows,
  FaPhone,
  FaRandom,
  FaTransgender,
  FaUser,
} from "react-icons/fa";
import { LoggedInUserType } from "@/types/types/auth.types";
import {
  CurrentFormType,
  ExperienceType,
  PersonalDetailType,
  ProfileActionButtonType,
  UserProfileType,
} from "@/types/types/profile.types";
import { toTitleCase } from "@/utils/common.utils";
import { formatLocalDate } from "@/utils/date.utils";
import { RelationshipType } from "@/types/types/connection.types";
import { FiMoreHorizontal } from "react-icons/fi";

export const getFullName = (user?: UserProfileType | LoggedInUserType) => {
  if (!user) return "John Doe";

  const { fullName, firstName, lastName, userName, email } = user;

  if (fullName) return toTitleCase(fullName);
  if (firstName && lastName) return toTitleCase(`${firstName} ${lastName}`);
  if (firstName) return toTitleCase(firstName);
  if (lastName) return toTitleCase(lastName);
  if (userName) return userName;
  if (email) return email;

  return "John Doe";
};

export const getCurrentJobRole = (experiences?: ExperienceType[]) => {
  if (!experiences?.length) return null;

  let latest: ExperienceType | null = null;

  for (const exp of experiences) {
    if (exp?.isCurrent && exp?.role) return exp.role;

    if (
      exp?.role &&
      exp?.startDate &&
      (!latest || new Date(exp.startDate) > new Date(latest.startDate))
    ) {
      latest = exp;
    }
  }

  return latest?.role ?? null;
};

export const dataURLtoImage = async (dataUrl: string, imageName: string) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], imageName, { type: blob.type });
};

export const compressImage = async (image: File): Promise<File> => {
  const compressedImage = new Image();
  compressedImage.src = URL.createObjectURL(image);

  await new Promise((resolve) => (compressedImage.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const MAX_WIDTH = 800;

  const scale = Math.min(1, MAX_WIDTH / compressedImage.width);

  canvas.width = compressedImage.width * scale;
  canvas.height = compressedImage.height * scale;

  ctx.drawImage(compressedImage, 0, 0, canvas.width, canvas.height);

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob(resolve as any, "image/jpeg", 0.7),
  );

  return new File([blob], image.name, { type: "image/jpeg" });
};

export const normalizeExperienceDates = (
  data?: ExperienceType[],
): ExperienceType[] => {
  if (!data?.length) return [];

  return data.map(
    (exp) =>
      ({
        ...exp,
        startDate: exp.startDate ? formatLocalDate(exp.startDate) : "",
        endDate: exp.endDate ? formatLocalDate(exp.endDate) : null,
      }) as ExperienceType,
  );
};

export const mergeUniqueUsersByKey = <T, K extends keyof T>(
  prev: T[],
  next: T[],
  key: K,
): T[] => {
  const existing = new Set(prev.map((item) => item[key]));

  const additions = next.filter(
    (item) => item[key] != null && !existing.has(item[key]),
  );

  if (additions.length === 0) return prev;

  return [...prev, ...additions];
};

const actionButtonClass = "flex items-center gap-2 px-4 py-2 btn";
const primaryActionButtonClass = `${actionButtonClass} btn-primary`;
const successActionButtonClass = `${actionButtonClass} text-status-success-text`;
const errorActionButtonClass = `${actionButtonClass} text-status-error-text`;
const infoActionButtonClass = `${actionButtonClass} text-status-info-text`;
const successActionWrapperClass = "p-0 rounded-lg alert alert-success";
const errorActionWrapperClass = "p-0 rounded-lg alert alert-error";
const infoActionWrapperClass = "p-0 rounded-lg alert alert-info";
const iconActionClass =
  "flex items-center gap-2 p-3 focus:ring-1 focus:ring-accent-purple-light glass";

export const getRelationship = (profile: UserProfileType): RelationshipType => {
  if (profile.connectionStatus === "accepted") return "connected";
  if (profile.connectionStatus === "blocked") return "blocked";
  if (profile.connectionStatus === "interested") {
    return profile.connectionDirection === "incoming" ? "incoming" : "outgoing";
  }

  return "none";
};

export const relationshipActions: Record<
  RelationshipType,
  ProfileActionButtonType[]
> = {
  connected: [
    {
      label: "Remove",
      ariaLabel: "Remove connection",
      icon: LuUserMinus,
      className: errorActionButtonClass,
      wrapperClassName: errorActionWrapperClass,
    },
    {
      label: "Chat",
      ariaLabel: "Open conversation",
      icon: LuMessageCircle,
      className: infoActionButtonClass,
      wrapperClassName: infoActionWrapperClass,
      action: "message",
    },
    {
      ariaLabel: "More profile actions",
      icon: FiMoreHorizontal,
      className: iconActionClass,
    },
  ],
  incoming: [
    {
      label: "Accept",
      ariaLabel: "Accept connection request",
      icon: LuCheck,
      className: successActionButtonClass,
      wrapperClassName: successActionWrapperClass,
    },
    {
      label: "Reject",
      ariaLabel: "Reject connection request",
      icon: LuX,
      className: errorActionButtonClass,
      wrapperClassName: errorActionWrapperClass,
    },
    {
      ariaLabel: "More profile actions",
      icon: FiMoreHorizontal,
      className: iconActionClass,
    },
  ],
  outgoing: [
    {
      label: "Cancel",
      ariaLabel: "Cancel connection request",
      icon: LuClock,
      className: infoActionButtonClass,
      wrapperClassName: infoActionWrapperClass,
    },
    {
      ariaLabel: "More profile actions",
      icon: FiMoreHorizontal,
      className: iconActionClass,
    },
  ],
  blocked: [
    {
      label: "Unblock",
      ariaLabel: "Unblock profile",
      icon: LuUserPlus,
      className: successActionButtonClass,
      wrapperClassName: successActionWrapperClass,
    },
    {
      ariaLabel: "More profile actions",
      icon: FiMoreHorizontal,
      className: iconActionClass,
    },
  ],
  none: [
    {
      label: "Connect",
      ariaLabel: "Send connection request",
      icon: LuUserPlus,
      className: primaryActionButtonClass,
    },
    {
      ariaLabel: "More profile actions",
      icon: FiMoreHorizontal,
      className: iconActionClass,
    },
  ],
};

const getGenderIcon = (gender?: string | null) => {
  if (gender === "male") return FaMale;
  if (gender === "female") return FaFemale;

  return FaTransgender;
};

const getMaritalStatusIcon = (maritalStatus?: string | null) => {
  if (maritalStatus === "married") return FaHeart;
  if (maritalStatus === "single") return FaUser;
  if (maritalStatus === "separated") return FaPeopleArrows;
  if (maritalStatus === "divorced") return MdHeartBroken;

  return FaRandom;
};

export const getPersonalDetails = (
  userProfile: UserProfileType | null,
): PersonalDetailType[] => {
  return [
    {
      key: "email",
      label: "Email",
      value: userProfile?.email,
      emptyText: "Add email address",
      icon: MdEmail,
      isVerified: userProfile?.emailVerified,
      canVerify: Boolean(userProfile?.email && !userProfile?.emailVerified),
    },
    {
      key: "phone",
      label: "Phone",
      value: userProfile?.phone ? String(userProfile.phone) : "",
      emptyText: "Add phone number",
      icon: FaPhone,
      isVerified: userProfile?.phoneVerified,
    },
    {
      key: "dob",
      label: "Birthday",
      value: userProfile?.dob,
      emptyText: "Add birthday",
      icon: FaBirthdayCake,
    },
    {
      key: "gender",
      label: "Gender",
      value: userProfile?.gender ? toTitleCase(userProfile.gender) : "",
      emptyText: "Add gender",
      icon: getGenderIcon(userProfile?.gender),
    },
    {
      key: "maritalStatus",
      label: "Relationship",
      value: userProfile?.maritalStatus
        ? toTitleCase(userProfile.maritalStatus)
        : "",
      emptyText: "Add relationship status",
      icon: getMaritalStatusIcon(userProfile?.maritalStatus),
    },
  ];
};

export const getEditProfileSections = (userProfile: UserProfileType | null) => {
  const profileSections = [
    {
      id: "basic" as CurrentFormType,
      icon: LuUser,
      title: "Name & Nickname",
      description: "First name, last name, and display nickname",
    },
    {
      id: "username" as CurrentFormType,
      icon: LuAtSign,
      title: "Username",
      description: "Your unique @handle and profile URL",
    },
    {
      id: "social" as CurrentFormType,
      icon: LuShare2,
      title: "Social Links",
      description: "GitHub, LinkedIn, Twitter, and more",
    },
    {
      id: "email" as CurrentFormType,
      icon: MdEmail,
      title: "Email",
      description: "Your unique email",
    },
    {
      id: "phone" as CurrentFormType,
      icon: FaPhone,
      title: "Phone",
      description: "Your phone number",
    },
    {
      id: "dob" as CurrentFormType,
      icon: FaBirthdayCake,
      title: "Date of Birth",
      description: "Your date of birth",
    },
    {
      id: "gender" as CurrentFormType,
      icon: getGenderIcon(userProfile?.gender),
      title: "Gender",
      description: "Your gender",
    },
    {
      id: "maritalStatus" as CurrentFormType,
      icon: getMaritalStatusIcon(userProfile?.maritalStatus),
      title: "Relationship Status",
      description: "Your relationship status",
    },
    {
      id: "bio" as CurrentFormType,
      icon: FaBirthdayCake,
      title: "About Me",
      description: "Snapshot of background, personality and more",
    },
    {
      id: "experience" as CurrentFormType,
      icon: FaBirthdayCake,
      title: "Work Experience",
      description: "Professional journey, roles and more",
    },
    {
      id: "skills" as CurrentFormType,
      icon: FaBirthdayCake,
      title: "Tech Stack & Expertise",
      description: "Core technologies, tools, and expertise",
    },
    {
      id: "interests" as CurrentFormType,
      icon: FaBirthdayCake,
      title: "Interests & Hobbies",
      description: "Passions, hobbies and more",
    },
  ];

  const hasDob = Boolean(userProfile?.dob);
  const hasGender = Boolean(userProfile?.gender);

  let allowedProfileSections = !hasDob
    ? profileSections
    : profileSections.filter((section) => section.id !== "dob");

  allowedProfileSections = !hasGender
    ? allowedProfileSections
    : allowedProfileSections.filter((section) => section.id !== "gender");

  return allowedProfileSections;
};
