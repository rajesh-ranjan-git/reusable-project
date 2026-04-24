import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuMessageSquare, LuUserPlus } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import { ProfileHeaderProps } from "@/types/props/profile.props.types";
import { ImageTargetType } from "@/types/types/profile.types";
import { useAppStore } from "@/store/store";
import { compressImage, dataURLtoImage } from "@/helpers/profile.helpers";
import { validateImage } from "@/validators/profile.validators";
import { useToast } from "@/hooks/toast";
import { chatRoutes } from "@/lib/routes/routes";
import { uploadImage } from "@/lib/actions/profile.actions";
import CameraModal from "@/components/shared/camera.modal";
import ProfileCover from "@/components/profile/cover";
import ProfileAvatar from "@/components/profile/avatar";
import ProfileMain from "@/components/profile/profile.main";
import ProfileImagePreview from "@/components/profile/image.preview";

const ProfileHeader = ({ isOwnProfile, user }: ProfileHeaderProps) => {
  const [activeMenu, setActiveMenu] = useState<ImageTargetType>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentImageTarget, setCurrentImageTarget] =
    useState<ImageTargetType>(null);
  const [localAvatar, setLocalAvatar] = useState(user?.avatar);
  const [localCover, setLocalCover] = useState(user?.cover);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToast();

  const loggedInUser = useAppStore((state) => state.loggedInUser);

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

      const uniqueImageName = `${currentImageTarget}-${loggedInUser?.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      const image = new File([file], uniqueImageName, {
        type: file.type,
      });

      validateImage(image);

      const compressedImage = await compressImage(image);

      const imageUrl = createPreviewUrl(compressedImage);

      if (currentImageTarget === "avatar") setLocalAvatar(imageUrl);
      if (currentImageTarget === "cover") setLocalCover(imageUrl);

      const response = await uploadImage(compressedImage, currentImageTarget);

      if (!response.success) {
        showToast({
          title: response.code,
          message: response.message,
          variant: "error",
        });

        if (currentImageTarget === "avatar" && previousImage) {
          setLocalAvatar(previousImage);
        }
        if (currentImageTarget === "cover" && previousImage) {
          setLocalCover(previousImage);
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

      const uniqueImageName = `${currentImageTarget}-${loggedInUser?.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.jpg`;

      const image = await dataURLtoImage(imgSrc, uniqueImageName);

      validateImage(image);

      const compressedImage = await compressImage(image);

      const response = await uploadImage(compressedImage, currentImageTarget);

      if (!response.success) {
        showToast({
          title: response.code,
          message: response.message,
          variant: "error",
        });
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
    setLocalAvatar(user?.avatar);
    setLocalCover(user?.cover);
  }, [user]);

  if (!user) return;

  return (
    <div className="z-(--z-raised) relative mb-6 glass-heavy rounded-t-2xl">
      <ProfileCover
        user={user}
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
            user={user}
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
              <button className="text-sm btn btn-secondary">
                <MdOutlineEdit size={16} />
                Update Profile
              </button>
            ) : (
              <>
                <button className="flex items-center gap-2 px-5 py-2 btn btn-primary">
                  <LuUserPlus size={16} />
                  Connect
                </button>
                <button
                  className="flex items-center gap-2 p-3 focus:ring-1 focus:ring-accent-purple-light glass"
                  onClick={() => router.push(chatRoutes.chat)}
                >
                  <LuMessageSquare size={16} />
                </button>
                <button className="flex items-center gap-2 p-3 focus:ring-1 focus:ring-accent-purple-light glass">
                  <FiMoreHorizontal size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        <ProfileMain user={user} />
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        title="Hidden file input"
      />

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />

      <ProfileImagePreview
        user={user}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </div>
  );
};

export default ProfileHeader;
