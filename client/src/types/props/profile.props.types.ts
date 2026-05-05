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
  userProfile: UserProfileType | null;
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

export interface ProfilePersonalProps {
  userProfile: UserProfileType | null;
  setUserProfile: Dispatch<SetStateAction<UserProfileType | null>>;
  isOwnProfile: boolean;
  currentForm: string | null;
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
}

export interface ProfileBioProps {
  bio?: string | null;
  isOwnProfile: boolean;
  setUserProfile: Dispatch<SetStateAction<UserProfileType | null>>;
  currentForm: string | null;
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
}

export interface ProfileInterestsProps {
  interests?: string[] | null;
  isOwnProfile: boolean;
  setUserProfile: Dispatch<SetStateAction<UserProfileType | null>>;
  currentForm: string | null;
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
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
  setUserProfile: Dispatch<SetStateAction<UserProfileType | null>>;
  currentForm: string | null;
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
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
  setUserProfile: Dispatch<SetStateAction<UserProfileType | null>>;
  currentForm: string | null;
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
}

export interface ExperienceProps {
  experiences: ExperienceType[];
}

export interface ActivitySectionProps {
  isOwnProfile: boolean;
  activities: ActivityType[];
}
