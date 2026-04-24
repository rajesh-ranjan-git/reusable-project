import { Dispatch, SetStateAction } from "react";
import {
  ActivityType,
  CurrentFormType,
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
  isOwnProfile: boolean;
  user: UserProfileType;
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
  user: UserProfileType;
}

export interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imgSrc: string) => void;
}

export interface InterestsFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string[];
  onSave: (interests: string[]) => void;
}

export interface SkillsFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SkillType[];
  onSave: (skills: SkillType[]) => void;
}

export interface InterestsProps {
  isOwnProfile: boolean;
  interests: string[] | null;
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
}

export interface SkillsProps {
  isOwnProfile: boolean;
  skills: SkillType[];
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
}

export interface ExperienceProps {
  isOwnProfile: boolean;
  experiences: ExperienceType[];
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
}

export interface ActivitySectionProps {
  isOwnProfile: boolean;
  activities: ActivityType[];
}
