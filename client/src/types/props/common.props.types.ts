import { Dispatch, ReactNode, SetStateAction } from "react";
import { HeaderType } from "@/types/types/common.types";

export interface ReactNodeProps {
  children: ReactNode;
}

export interface BannerProps {
  nodeVersion: string;
}

export interface HeaderProps {
  type: HeaderType;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: Dispatch<SetStateAction<boolean>>;
  sidebarProps?: Omit<AppSidebarProps, "setIsSidebarOpen">;
}

export interface LogoProps {
  type?: HeaderType;
}

export interface HeaderSearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  positionClass?: string;
  searchQuery: string;
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

export interface AppSidebarProps {
  setIsSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}
