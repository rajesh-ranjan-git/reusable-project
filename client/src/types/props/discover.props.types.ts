import { SwipeDirectionType } from "@/types/types/discover.types";
import { UserProfileType } from "@/types/types/profile.types";

export interface ActionBarProps {
  onSwipe: (direction: SwipeDirectionType, userId?: string) => void;
  loadingProfiles: boolean;
}

export interface SwipeCardProps {
  profile: UserProfileType;
  onSwipe: (direction: SwipeDirectionType, userId?: string) => void;
  active: boolean;
}
