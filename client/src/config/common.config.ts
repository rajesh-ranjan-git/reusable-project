import { StaticImagesConfigType } from "@/types/types/common.types";

export const appConfig = {
  name: "App Name",
  description: "App's description.",
};

export const themeConfig = {
  dark: "dark",
  light: "light",
} as const;

export const storageConfig = {
  local: "local",
  session: "session",
} as const;

export const jwtKnownErrorsConfig = {
  tokenExpiredError: "TokenExpiredError",
  jwtError: "JsonWebTokenError",
  notBeforeError: "NotBeforeError",
};

export const staticImagesConfig: StaticImagesConfigType = {
  navLogo: {
    src: "/assets/logo/app-logo-transparent.webp",
    alt: "app-logo",
  },
  mainLogo: {
    src: "/assets/logo/app-logo.webp",
    alt: "app-logo",
  },
  notFoundError: {
    src: "/assets/error/404-error.webp",
    alt: "404-error",
  },
  unexpectedError: {
    src: "/assets/error/something-went-wrong-error.webp",
    alt: "unexpected-error",
  },
  avatarPlaceholder: {
    src: "/assets/avatar/user.webp",
    alt: "avatar-icon",
  },
  coverPlaceholder: {
    src: "/assets/cover/cover.webp",
    alt: "cover-pic",
  },
};

export const timelineConfig = {
  oneHour: 1000 * 60 * 60,
  twoHours: 1000 * 60 * 60 * 2,
  threeHours: 1000 * 60 * 60 * 3,
  sixHours: 1000 * 60 * 60 * 6,
  halfDay: 1000 * 60 * 60 * 12,
  oneDay: 1000 * 60 * 60 * 24,
  twoDays: 1000 * 60 * 60 * 24 * 2,
  threeDays: 1000 * 60 * 60 * 24 * 3,
  oneWeek: 1000 * 60 * 60 * 24 * 7,
  twoWeeks: 1000 * 60 * 60 * 24 * 7 * 2,
  threeWeeks: 1000 * 60 * 60 * 24 * 7 * 3,
  oneMonth: 1000 * 60 * 60 * 24 * 30,
  twoMonths: 1000 * 60 * 60 * 24 * 30 * 2,
  threeMonths: 1000 * 60 * 60 * 24 * 30 * 3,
  sixMonths: 1000 * 60 * 60 * 24 * 30 * 6,
  oneYear: 1000 * 60 * 60 * 24 * 30 * 12,
  twoYears: 1000 * 60 * 60 * 24 * 30 * 12 * 2,
  fourYears: 1000 * 60 * 60 * 24 * 30 * 12 * 3,
};
