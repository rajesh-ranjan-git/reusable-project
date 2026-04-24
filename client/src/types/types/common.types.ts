import { storageConfig, themeConfig } from "@/config/common.config";

export type HeaderType = "default" | "landing" | "admin";

export type StaticImagesConfigType = Record<
  string,
  {
    src: string;
    alt: string;
  }
>;

export type ThemeType = keyof typeof themeConfig;

export type StorageType = keyof typeof storageConfig;

export type StoredDataType<T> = {
  data: T;
  expiresAt?: number;
};
