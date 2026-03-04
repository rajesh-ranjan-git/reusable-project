import { ReactNode, RefObject } from "react";
import { StorageTypes, ContextMenuTypes, SheetTypes } from "@/types/types";

export interface FormErrorMessageProps {
  errors: string[] | null;
  className?: string;
}

export interface UseOutsideClickProps {
  ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];
  when: boolean;
  callback: () => void;
}

export interface UseContextMenuProps {
  type: ContextMenuTypes;
}

export interface UseSheetProps {
  type: SheetTypes;
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
