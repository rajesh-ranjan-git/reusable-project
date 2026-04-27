import { LoggedInUserType } from "@/types/types/auth.types";
import { ExperienceType, UserProfileType } from "@/types/types/profile.types";
import { toTitleCase } from "@/utils/common.utils";
import { formatLocalDate } from "@/utils/date.utils";

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
