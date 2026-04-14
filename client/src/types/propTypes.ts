import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { HeaderTypes, StorageTypes } from "@/types/types";

export interface ReactNodeProps {
  children: ReactNode;
}

export interface HeaderProps {
  type: HeaderTypes;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}

export interface UseOutsideClickProps {
  ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];
  when: boolean;
  callback: () => void;
}

export interface UseWebStorageProps<T> {
  key: string;
  value: T;
  type?: StorageTypes;
  expiresIn?: number;
}

export interface BannerProps {
  nodeVersion: string;
}

export interface FormErrorMessageProps {
  error: string | null;
  className?: string;
}

export interface AdminProps {
  params: { type: string };
}

export interface AdminPageProps {
  type: string;
}

export interface AdminSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}
