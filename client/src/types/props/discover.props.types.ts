import { ReactNode } from "react";
import { SwipeDirectionType } from "@/types/types/discover.types";
import { UserProfileType } from "@/types/types/profile.types";
import { ApiErrorResponseType } from "@/types/types/api.types";

export interface DiscoverLayoutProps {
  children: ReactNode;
  isLoading?: boolean;
  handleSwipe?: () => void;
  error?: ApiErrorResponseType;
}

export interface DiscoverErrorProps {
  error: ApiErrorResponseType;
}

export interface ActionBarProps {
  onSwipe: (direction: SwipeDirectionType, userId?: string) => void;
  loadingProfiles?: boolean;
}

export interface SwipeCardProps {
  profile: UserProfileType;
  onSwipe: (direction: SwipeDirectionType, userId?: string) => void;
  active: boolean;
}
