import { storageConfig, themeConfig } from "@/config/common.config";

export type HeaderTypes = "default" | "landing" | "admin";

export type StaticImageType = Record<
  string,
  {
    src: string;
    alt: string;
  }
>;

export type ThemeTypes = keyof typeof themeConfig;

export type StorageTypes = keyof typeof storageConfig;

export type StoredDataType<T> = {
  data: T;
  expiresAt?: number;
};

export type LoggedInUserType = {
  id: string;
  status: string;
  email: string;
  role: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatar: string;
} | null;
