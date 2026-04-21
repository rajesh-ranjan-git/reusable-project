import { ALLOWED_TYPES, MAX_IMAGE_SIZE } from "@/constants/common.constants";
import { LoggedInUserType } from "@/types/types";
import { toTitleCase } from "@/utils/common.utils";

type Skill = {
  name: string;
  level: string;
  icon?: string;
} | null;

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

export const getFullName = (user?: UserProfileType | LoggedInUserType) => {
  if (!user) return "John Doe";

  const { firstName, lastName, userName, email } = user;

  if (firstName && lastName) return toTitleCase(`${firstName} ${lastName}`);
  if (firstName) return toTitleCase(firstName);
  if (lastName) return toTitleCase(lastName);
  if (userName) return userName;
  if (email) return email;

  return "John Doe";
};

export const getCurrentJobRole = (experiences?: Experience[]) => {
  if (!experiences?.length) return null;

  let latest: Experience | null = null;

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

export const validateImage = (image: File) => {
  if (!ALLOWED_TYPES.includes(image.type)) {
    throw new Error("Only JPG, PNG, WEBP allowed");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be less than 2MB");
  }
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
