import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  ActivityType,
  ExperienceType,
  ImageTargetType,
  SkillType,
  UserProfileType,
} from "@/types/types/profile.types";

export interface ProfileProps {
  params: {
    userName: string;
  };
}

export interface ProfilePageProps {
  userName?: string;
}

export interface ProfileHeaderProps {
  userProfile: UserProfileType | null;
  isOwnProfile: boolean;
}

export interface ProfileMenuItemProps {
  item: {
    title: string;
    url?: string;
    icon: ReactNode;
  };
  handleNavigation: (url: string) => void;
}

export interface ProfileImageProps {
  user: UserProfileType;
  handleImagePreview: (imageSrc: string) => void;
  isImageUploading: boolean;
  currentImageTarget: ImageTargetType;
  isOwnProfile: boolean;
  activeMenu: ImageTargetType;
  setActiveMenu: Dispatch<SetStateAction<ImageTargetType>>;
  handleUploadClick: (currentImageTarget: ImageTargetType) => void;
  handleCameraClick: (currentImageTarget: ImageTargetType) => void;
}

export interface AvatarProps extends ProfileImageProps {
  localAvatar?: string | null;
}

export interface CoverProps extends ProfileImageProps {
  localCover?: string | null;
}

export interface ImagePreviewProps {
  user: UserProfileType;
  previewImage: string | null;
  setPreviewImage: Dispatch<SetStateAction<string | null>>;
}

export interface ProfileMainProps {
  userProfile: UserProfileType;
  isOwnProfile: boolean;
}

export interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imgSrc: string) => void;
}

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileType | null;
}

export interface ProfilePersonalProps {
  userProfile: UserProfileType | null;
  isOwnProfile: boolean;
}

export interface ProfileBioProps {
  bio?: string | null;
  isOwnProfile: boolean;
}

export interface ProfileInterestsProps {
  interests?: string[] | null;
  isOwnProfile: boolean;
}

export interface InterestsFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string[];
  onSave: (interests: string[]) => void;
}

export interface InterestsProps {
  interests: string[] | null;
}

export interface ProfileSkillsProps {
  skills?: SkillType[] | null;
  isOwnProfile: boolean;
}

export interface SkillsFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SkillType[];
  onSave: (skills: SkillType[]) => void;
}

export interface SkillsProps {
  skills: SkillType[];
}

export interface ProfileExperienceProps {
  experiences?: ExperienceType[] | null;
  isOwnProfile: boolean;
}

export interface ProfileFormsProps {
  userProfile: UserProfileType | null;
  onSave: (updated: Partial<UserProfileType>) => void;
}

export interface ExperienceProps {
  experiences: ExperienceType[];
}

export interface ActivitySectionProps {
  isOwnProfile: boolean;
  activities: ActivityType[];
}
