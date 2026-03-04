import { storageConfig, themeConfig } from "@/config/config";

export type SheetTypes = "requests" | "connections" | null;

export type ContextMenuTypes =
  | "addButtonContext"
  | "updateCoverPhotoContext"
  | "updateProfilePhotoContext"
  | "updateProfileDetailsContext"
  | "updateSpecificProfileDetailsContext"
  | "updatePasswordContext"
  | "deleteAccountContext"
  | null;

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
