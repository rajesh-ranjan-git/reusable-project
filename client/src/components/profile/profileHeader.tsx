import { useState, useRef, ChangeEvent, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  LuCalendar,
  LuCamera,
  LuMapPin,
  LuMessageSquare,
  LuUserPlus,
  LuX,
} from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLink,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import { staticImages } from "@/config/common.config";
import { useAppStore } from "@/store/store";
import { toTitleCase } from "@/utils/common.utils";
import { getDateToShow } from "@/utils/date.utils";
import {
  compressImage,
  dataURLtoImage,
  getCurrentJobRole,
  getFullName,
  validateImage,
} from "@/helpers/helpers";
import { chatRoutes } from "@/lib/routes/routes";
import { uploadImage } from "@/lib/actions/profileActions";
import { useToast } from "@/hooks/toast";
import ImageUploadMenu from "@/components/shared/imageUploadMenu";
import CameraModal from "@/components/shared/cameraModal";

type Skill = {
  name: string;
  level: string;
  icon?: string;
} | null;

type Social = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
} | null;

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
} | null;

type UserProfileType = {
  id: string;
  email: string;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  nickName: string | null;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  location: string | null;
  skills: Skill[] | null;
  interests: string[] | null;
  social: Social;
  experiences: Experience[] | null;
  createdAt: string;
  updatedAt: string | null;
} | null;

type ImageTarget = "cover" | "avatar" | null;

type ProfileHeaderProps = {
  isOwnProfile: boolean;
  user: UserProfileType;
};

const socialIcons = [
  { key: "github", Icon: FaGithub, label: "GitHub" },
  { key: "linkedin", Icon: FaLinkedin, label: "LinkedIn" },
  { key: "twitter", Icon: FaTwitter, label: "Twitter / X" },
  { key: "instagram", Icon: FaInstagram, label: "Instagram" },
  { key: "facebook", Icon: FaFacebook, label: "Facebook" },
] as const;

const ProfileHeader = ({ isOwnProfile, user }: ProfileHeaderProps) => {
  const [activeMenu, setActiveMenu] = useState<ImageTarget>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentImageTarget, setCurrentImageTarget] =
    useState<ImageTarget>(null);
  const [localAvatar, setLocalAvatar] = useState(user?.avatar);
  const [localCover, setLocalCover] = useState(user?.cover);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToast();

  const accessToken = useAppStore((state) => state.accessToken);
  const loggedInUser = useAppStore((state) => state.loggedInUser);

  const handleUploadClick = (target: ImageTarget) => {
    setCurrentImageTarget(target);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = (target: ImageTarget) => {
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

      const response = await uploadImage(
        compressedImage,
        currentImageTarget,
        accessToken!,
      );

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

      const response = await uploadImage(
        compressedImage,
        currentImageTarget,
        accessToken!,
      );

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
      <div className="group relative bg-black rounded-t-2xl w-full h-32 md:h-48">
        <Image
          src={localCover ? localCover : staticImages.coverPlaceholder.src}
          alt={getFullName(user) ?? "User Cover"}
          width={1600}
          height={800}
          className="opacity-80 group-hover:opacity-60 rounded-t-2xl w-full h-full object-cover transition-opacity cursor-pointer"
          onClick={() =>
            handleImagePreview(
              localCover ? localCover : staticImages.coverPlaceholder.src,
            )
          }
        />

        {isImageUploading && currentImageTarget === "cover" && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-t-2xl">
            <TbLoader3 className="w-6 h-6 animate-spin" />
          </div>
        )}

        {isOwnProfile && (
          <div className="top-4 right-4 z-(--z-modal) absolute flex flex-col items-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === "cover" ? null : "cover");
              }}
              className="hidden relative sm:flex backdrop-blur-md px-2 sm:px-4 hover:text-text-primary text-xs transition-colors text-accent-purple-light glass-interactive"
            >
              <LuCamera size={16} />
              <span className="hidden sm:inline">Update Cover Photo</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === "cover" ? null : "cover");
              }}
              className="sm:hidden relative bg-glass-bg-strong backdrop-blur-md px-2 hover:text-text-primary text-xs transition-colors text-accent-purple-dark glass-interactive"
            >
              <LuCamera size={18} />
            </button>

            <div className="relative flex justify-end w-full">
              <ImageUploadMenu
                isOpen={activeMenu === "cover"}
                onClose={() => setActiveMenu(null)}
                onUploadClick={() => handleUploadClick("cover")}
                onCameraClick={() => handleCameraClick("cover")}
                positionClass="top-2 right-0"
              />
            </div>
          </div>
        )}
      </div>

      <div className="z-20 relative px-6 pb-6 pointer-events-none">
        <div className="flex md:flex-row flex-col justify-between md:items-end gap-4 -mt-12 md:-mt-16 mb-4">
          <div className="group inline-block relative self-start md:self-auto pointer-events-auto">
            <Image
              src={
                localAvatar ? localAvatar : staticImages.avatarPlaceholder.src
              }
              alt={getFullName(user) ?? "User Cover"}
              width={400}
              height={400}
              className="z-(--z-base) relative bg-glass shadow-xl border-4 border-bg rounded-xl w-24 md:w-32 h-24 md:h-32 object-cover hover:scale-[1.02] transition-transform cursor-pointer"
              onClick={() =>
                handleImagePreview(
                  localAvatar
                    ? localAvatar
                    : staticImages.avatarPlaceholder.src,
                )
              }
            />

            {isImageUploading && currentImageTarget === "avatar" && (
              <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-xl">
                <TbLoader3 className="w-6 h-6 animate-spin" />
              </div>
            )}

            <div
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-bg z-(--z-raised) ${user ? "bg-green-500" : "bg-gray-500"}`}
            ></div>

            {isOwnProfile && (
              <div className="-top-2 -right-2 z-30 absolute">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === "avatar" ? null : "avatar");
                  }}
                  className="relative backdrop-blur-md px-2 hover:text-text-primary text-xs transition-colors text-accent-purple-light glass-interactive"
                >
                  <LuCamera size={18} />
                </button>

                <ImageUploadMenu
                  isOpen={activeMenu === "avatar"}
                  onClose={() => setActiveMenu(null)}
                  onUploadClick={() => handleUploadClick("avatar")}
                  onCameraClick={() => handleCameraClick("avatar")}
                  positionClass="top-full left-0 md:left-auto mt-2"
                />
              </div>
            )}
          </div>

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

        <div className="pointer-events-auto">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-arima font-extrabold">{getFullName(user)}</h1>

            {user?.nickName ? (
              <span className="text-text-muted text-base md:text-lg italic">
                &ldquo;{toTitleCase(user.nickName)}&rdquo;
              </span>
            ) : null}
          </div>

          <p className="mt-0.5 text-text-muted text-sm">@{user.userName}</p>

          {user?.experiences?.length && user?.experiences?.length > 0 ? (
            <p className="mt-1 text-text-secondary text-base md:text-lg">
              {toTitleCase(getCurrentJobRole(user?.experiences) ?? "No role")}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text-secondary text-sm">
            {user?.social && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pointer-events-auto">
                {socialIcons.map(({ key, Icon, label }) => {
                  const href =
                    user.social?.[key as keyof NonNullable<typeof user.social>];
                  if (!href) return null;
                  return (
                    <Link
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      title={label}
                      className="flex justify-center items-center w-9 h-9 text-text-secondary hover:text-text-primary hover:scale-105 transition-transform glass"
                    >
                      <Icon size={16} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-text-secondary text-sm">
            {user?.location && (
              <div className="flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer">
                <LuMapPin size={16} />
                {toTitleCase(user.location)}
              </div>
            )}

            {user?.social?.website && (
              <Link
                href={user.social.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-primary hover:text-indigo-400 transition-colors"
              >
                <FaLink size={16} />
                {user.social.website.replace(/^https?:\/\//, "")}
              </Link>
            )}

            {user?.createdAt && (
              <div className="flex items-center gap-1.5">
                <LuCalendar size={16} />
                Joined {getDateToShow(user.createdAt)}
              </div>
            )}
          </div>
        </div>
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

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {previewImage && (
              <div className="z-200 fixed inset-0 flex justify-center items-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 backdrop-blur-md"
                  onClick={() => setPreviewImage(null)}
                />

                <motion.img
                  key={previewImage}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{
                    scale: 0.9,
                    opacity: 0,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  src={previewImage}
                  alt={getFullName(user)}
                  className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl max-w-full max-h-[90vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  className="top-6 right-6 absolute p-2 rounded-full glass"
                  onClick={() => setPreviewImage(null)}
                >
                  <LuX size={24} />
                </button>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};

export default ProfileHeader;
