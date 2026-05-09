import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineEdit } from "react-icons/md";
import { ProfileHeaderProps } from "@/types/props/profile.props.types";
import {
  ImageTargetType,
  ProfileActionButtonType,
} from "@/types/types/profile.types";
import { UploadImageResponseType } from "@/types/types/response.types";
import { useAppStore } from "@/store/store";
import { useNetworkActions } from "@/hooks/useNetworkActions";
import {
  compressImage,
  dataURLtoImage,
  getRelationship,
  relationshipActions,
} from "@/helpers/profile.helpers";
import { validateImage } from "@/validators/profile.validators";
import { useToast } from "@/hooks/toast";
import { conversationRoutes } from "@/lib/routes/routes";
import { uploadImage } from "@/lib/actions/profile.actions";
import CameraModal from "@/components/shared/camera.modal";
import EditProfileModal from "@/components/shared/edit.profile.modal";
import ProfileCover from "@/components/profile/cover";
import ProfileAvatar from "@/components/profile/avatar";
import ProfileMain from "@/components/profile/profile.main";
import ProfileImagePreview from "@/components/profile/image.preview";

const ProfileHeader = ({ userProfile, isOwnProfile }: ProfileHeaderProps) => {
  const [activeMenu, setActiveMenu] = useState<ImageTargetType>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentImageTarget, setCurrentImageTarget] =
    useState<ImageTargetType>(null);
  const [localAvatar, setLocalAvatar] = useState(userProfile?.avatar);
  const [localCover, setLocalCover] = useState(userProfile?.cover);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const [pendingRelationshipAction, setPendingRelationshipAction] = useState<
    string | null
  >(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const { showToast } = useToast();

  const networkActions = useNetworkActions();

  const loggedInUser = useAppStore((state) => state.loggedInUser);
  const setLoggedInUser = useAppStore((state) => state.setLoggedInUser);

  const handleUploadClick = (target: ImageTargetType) => {
    setCurrentImageTarget(target);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = (target: ImageTargetType) => {
    setCurrentImageTarget(target);
    setIsCameraOpen(true);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !currentImageTarget) return;

    try {
      if (currentImageTarget === "avatar") {
        setPreviousImage(localAvatar as string);
      }
      if (currentImageTarget === "cover") {
        setPreviousImage(localCover as string);
      }

      setIsImageUploading(true);

      const uniqueImageName = `${currentImageTarget}-${loggedInUser?.userId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      const image = new File([file], uniqueImageName, {
        type: file.type,
      });

      validateImage(image);

      const compressedImage = await compressImage(image);

      const imageUrl = createPreviewUrl(compressedImage);

      if (currentImageTarget === "avatar") setLocalAvatar(imageUrl);
      if (currentImageTarget === "cover") setLocalCover(imageUrl);

      const uploadImageResponse = await uploadImage(
        compressedImage,
        currentImageTarget,
      );

      if (!uploadImageResponse.success) {
        showToast({
          title: uploadImageResponse.code,
          message: uploadImageResponse.message,
          variant: "error",
        });

        if (currentImageTarget === "avatar" && previousImage) {
          setLocalAvatar(previousImage);
        }
        if (currentImageTarget === "cover" && previousImage) {
          setLocalCover(previousImage);
        }
      } else {
        const uploadImageResponseData =
          uploadImageResponse.data as UploadImageResponseType;

        if (currentImageTarget === "avatar") {
          setLoggedInUser((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              avatar: uploadImageResponseData.avatar ?? localAvatar,
            };
          });
        }
      }
    } catch (error) {
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleCapture = async (imgSrc: string) => {
    if (!currentImageTarget) return;

    try {
      setIsImageUploading(true);

      if (currentImageTarget === "avatar") {
        setLocalAvatar(imgSrc);
        setPreviousImage(localAvatar as string);
      }
      if (currentImageTarget === "cover") {
        setLocalCover(imgSrc);
        setPreviousImage(localCover as string);
      }

      const uniqueImageName = `${currentImageTarget}-${loggedInUser?.userId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.jpg`;

      const image = await dataURLtoImage(imgSrc, uniqueImageName);

      validateImage(image);

      const compressedImage = await compressImage(image);

      const uploadImageResponse = await uploadImage(
        compressedImage,
        currentImageTarget,
      );

      if (!uploadImageResponse.success) {
        showToast({
          title: uploadImageResponse.code,
          message: uploadImageResponse.message,
          variant: "error",
        });
      } else {
        const uploadImageResponseData =
          uploadImageResponse.data as UploadImageResponseType;

        if (currentImageTarget === "avatar") {
          setLoggedInUser((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              avatar: uploadImageResponseData?.avatar ?? localAvatar,
            };
          });
        }
      }
    } catch (error) {
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleImagePreview = (src: string) => {
    setPreviewImage(src);
  };

  const createPreviewUrl = (file: File) => {
    const imageUrl = URL.createObjectURL(file);

    if (currentImageTarget === "avatar") {
      if (localAvatar?.startsWith("blob:")) {
        URL.revokeObjectURL(localAvatar);
      }
      setLocalAvatar(imageUrl);
    }

    if (currentImageTarget === "cover") {
      if (localCover?.startsWith("blob:")) {
        URL.revokeObjectURL(localCover);
      }
      setLocalCover(imageUrl);
    }

    return imageUrl;
  };

  useEffect(() => {
    setLocalAvatar(userProfile?.avatar);
    setLocalCover(userProfile?.cover);
  }, [userProfile]);

  if (!userProfile) return;

  const sharedRelationshipState = {
    ...(networkActions?.connections.some(
      (connection) => connection.userId === userProfile.userId,
    )
      ? {
          connectionStatus: "accepted" as const,
          connectionDirection: null,
        }
      : {}),
    ...(networkActions?.connectionRequests.some(
      (request) => request.userId === userProfile.userId,
    )
      ? {
          connectionStatus: "interested" as const,
          connectionDirection: "incoming" as const,
        }
      : {}),
    ...(networkActions?.relationshipOverrides[userProfile.userId] ?? {}),
  };
  const syncedUserProfile = {
    ...userProfile,
    ...sharedRelationshipState,
  };
  const relationshipType = getRelationship(syncedUserProfile);

  const handleRelationshipAction = async (
    action: ProfileActionButtonType["action"],
  ) => {
    if (action === "more") return;

    if (action === "message") {
      router.push(`${conversationRoutes.conversation}/${userProfile.userName}`);
      return;
    }

    if (!networkActions || pendingRelationshipAction) return;

    setPendingRelationshipAction(action);

    try {
      if (action === "accept") {
        await networkActions.onRequestAction(userProfile.userId, "right");
        return;
      }

      if (action === "reject") {
        await networkActions.onRequestAction(userProfile.userId, "left");
        return;
      }

      const connectionStatusByAction = {
        connect: "interested",
        cancel: "not-interested",
        remove: "rejected",
        unblock: "not-interested",
      } as const;

      await networkActions.onConnectionAction(
        syncedUserProfile,
        connectionStatusByAction[action],
      );
    } finally {
      setPendingRelationshipAction(null);
    }
  };

  return (
    <div className="z-(--z-raised) relative mb-6 glass-heavy rounded-t-2xl">
      <ProfileCover
        user={userProfile}
        localCover={localCover}
        handleImagePreview={handleImagePreview}
        isImageUploading={isImageUploading}
        currentImageTarget={currentImageTarget}
        isOwnProfile={isOwnProfile}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleUploadClick={handleUploadClick}
        handleCameraClick={handleCameraClick}
      />

      <div className="z-20 relative px-6 pb-6 pointer-events-none">
        <div className="flex md:flex-row flex-col justify-between md:items-end gap-4 -mt-12 md:-mt-16 mb-4">
          <ProfileAvatar
            user={userProfile}
            localAvatar={localAvatar}
            handleImagePreview={handleImagePreview}
            isImageUploading={isImageUploading}
            currentImageTarget={currentImageTarget}
            isOwnProfile={isOwnProfile}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            handleUploadClick={handleUploadClick}
            handleCameraClick={handleCameraClick}
          />

          <div className="flex items-center gap-3 pointer-events-auto">
            {isOwnProfile ? (
              <button
                className="text-sm btn btn-secondary"
                onClick={() => setIsEditOpen(true)}
              >
                <MdOutlineEdit size={16} />
                Update Profile
              </button>
            ) : (
              relationshipActions[relationshipType].map(
                ({
                  label,
                  ariaLabel,
                  icon: Icon,
                  className,
                  wrapperClassName,
                  action,
                }) => {
                  const button = (
                    <button
                      key={ariaLabel}
                      aria-label={ariaLabel}
                      title={ariaLabel}
                      className={className}
                      disabled={pendingRelationshipAction === action}
                      onClick={() => handleRelationshipAction(action)}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  );

                  return wrapperClassName ? (
                    <div key={ariaLabel} className={wrapperClassName}>
                      {button}
                    </div>
                  ) : (
                    button
                  );
                },
              )
            )}
          </div>
        </div>

        <ProfileMain isOwnProfile={isOwnProfile} userProfile={userProfile} />
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        title="Hidden file input"
      />

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userProfile={userProfile}
      />

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />

      <ProfileImagePreview
        user={userProfile}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </div>
  );
};

export default ProfileHeader;
