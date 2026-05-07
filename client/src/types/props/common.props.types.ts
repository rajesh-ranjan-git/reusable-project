import { Dispatch, ReactNode, SetStateAction } from "react";
import { HeaderType } from "@/types/types/common.types";
import { UserProfileType } from "../types/profile.types";
import { RequestDirectionType } from "../types/connection.types";
import { ResponsePaginationType } from "../types/response.types";

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
  connectionRequests: UserProfileType[];
  connections: UserProfileType[];
  onRequestAction: (
    userId: string,
    direction: RequestDirectionType,
  ) => Promise<boolean | void>;
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
  connectionRequests: UserProfileType[];
  connections: UserProfileType[];
  exitDirection: Record<string, RequestDirectionType>;
  connectionRequestsPagination: ResponsePaginationType | null;
  connectionsPagination: ResponsePaginationType | null;
  onRequestAction: (
    userId: string,
    direction: RequestDirectionType,
  ) => Promise<boolean | void>;
  onLoadMoreRequests: (page: number) => Promise<void>;
  onLoadMoreConnections: (page?: number) => Promise<void>;
}
