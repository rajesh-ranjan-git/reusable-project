import { ProfileType, SwipeDirectionType } from "@/types/types/discover.types";

export interface ActionBarProps {
  onSwipe: (direction: SwipeDirectionType, id?: number) => void;
}

export interface SwipeCardProps {
  profile: ProfileType;
  onSwipe: (direction: SwipeDirectionType, id?: number) => void;
  active: boolean;
}
