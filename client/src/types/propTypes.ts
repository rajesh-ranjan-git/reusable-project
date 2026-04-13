import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { HeaderTypes, StorageTypes } from "@/types/types";

export interface HeaderProps {
  type: HeaderTypes;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}

export interface FormErrorMessageProps {
  errors: string[] | null;
  className?: string;
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

export interface ReactNodeProps {
  children: ReactNode;
}
