import { Dispatch, ReactNode, SetStateAction } from "react";
import { HeaderType } from "@/types/types/common.types";

export interface ReactNodeProps {
  children: ReactNode;
}

export interface HeaderProps {
  type: HeaderType;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}

export interface HeaderNotificationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  positionClass?: string;
}

export interface HeaderProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  positionClass?: string;
}

export interface BannerProps {
  nodeVersion: string;
}

export interface AppSidebarProps {
  setIsSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}
