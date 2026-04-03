import { useState, useRef, ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import ImageUploadMenu from "../shared/imageUploadMenu";
import {
  LuCalendar,
  LuCamera,
  LuMapPin,
  LuMessageSquare,
  LuUserPlus,
  LuX,
} from "react-icons/lu";
import { FaEdit, FaLink } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import CameraModal from "@/components/shared/cameraModal";

type User = {
  name: string;
  headline: string;
  location: string;
  website: string;
  joinedDate: string;
  coverImage: string;
  avatar: string;
  online: boolean;
};

type ImageTarget = "cover" | "avatar" | null;

type ProfileHeaderProps = { isOwnProfile: boolean; user: User };

export default function ProfileHeader({
  isOwnProfile,
  user,
}: ProfileHeaderProps) {
  const [activeMenu, setActiveMenu] = useState<ImageTarget>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentImageTarget, setCurrentImageTarget] =
    useState<ImageTarget>(null);

  const [localAvatar, setLocalAvatar] = useState(user.avatar);
  const [localCover, setLocalCover] = useState(user.coverImage);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = (target: ImageTarget) => {
    setCurrentImageTarget(target);
    fileInputRef.current?.click();
  };

  const handleCameraClick = (target: ImageTarget) => {
    setCurrentImageTarget(target);
    setIsCameraOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (currentImageTarget === "avatar") setLocalAvatar(url);
      if (currentImageTarget === "cover") setLocalCover(url);
    }
  };

  const handleCapture = (imgSrc: string) => {
    if (currentImageTarget === "avatar") setLocalAvatar(imgSrc);
    if (currentImageTarget === "cover") setLocalCover(imgSrc);
  };

  const handleImagePreview = (src: string) => {
    setPreviewImage(src);
  };

  return (
    <div className="z-(--z-raised) relative bg-white/60 dark:bg-surface/50 shadow-sm dark:shadow-lg backdrop-blur-md mb-6 border border-black/5 dark:border-white/5 rounded-2xl">
      {/* Cover Image Area */}
      <div className="group relative bg-black rounded-t-2xl w-full h-32 md:h-48">
        <img
          src={localCover}
          alt="Cover"
          className="opacity-80 group-hover:opacity-60 rounded-t-2xl w-full h-full object-cover transition-opacity cursor-pointer"
          onClick={() => handleImagePreview(localCover)}
        />

        {isOwnProfile && (
          <div className="top-4 right-4 z-(--z-raised) absolute flex flex-col items-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === "cover" ? null : "cover");
              }}
              className="flex items-center gap-2 bg-white hover:bg-primary dark:bg-[#0B0F1A] shadow-md dark:shadow-2xl p-2 md:px-3 border border-black/10 hover:border-primary dark:border-white/10 rounded-lg font-semibold text-text-primary hover:text-white text-xs transition-colors"
            >
              <LuCamera size={16} />{" "}
              <span className="hidden sm:inline">Update Cover Photo</span>
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
          {/* Avatar Area */}
          <div className="group inline-block relative self-start md:self-auto pointer-events-auto">
            <img
              src={localAvatar}
              alt={user.name}
              className="z-(--z-base) relative bg-bg shadow-xl border-4 border-bg rounded-xl w-24 md:w-32 h-24 md:h-32 object-cover hover:scale-[1.02] transition-transform cursor-pointer"
              onClick={() => handleImagePreview(localAvatar)}
            />
            <div
              className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-bg z-(--z-raised) ${user.online ? "bg-green-500" : "bg-gray-500"}`}
            ></div>

            {isOwnProfile && (
              <div className="-top-3 -right-3 z-30 absolute">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === "avatar" ? null : "avatar");
                  }}
                  className="bg-white hover:bg-primary dark:bg-[#0B0F1A] shadow-md dark:shadow-2xl p-2 border-2 border-primary/50 hover:border-primary rounded-full text-text-primary hover:text-white transition-colors"
                >
                  <LuCamera size={18} />
                </button>
                <ImageUploadMenu
                  isOpen={activeMenu === "avatar"}
                  onClose={() => setActiveMenu(null)}
                  onUploadClick={() => handleUploadClick("avatar")}
                  onCameraClick={() => handleCameraClick("avatar")}
                  positionClass="top-full left-0 md:left-auto md:right-0 mt-2"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            {isOwnProfile ? (
              <button className="flex items-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 px-5 py-2.5 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 font-medium text-text-primary text-sm transition-colors">
                <FaEdit size={16} />
                Update Profile
              </button>
            ) : (
              <>
                <button className="flex items-center gap-2 bg-primary hover:bg-indigo-600 active:bg-indigo-700 shadow-md shadow-primary/20 px-5 py-2.5 rounded-lg font-medium text-white text-sm transition-colors">
                  <LuUserPlus size={16} />
                  Connect
                </button>
                <button className="flex items-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 px-4 py-2.5 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 text-text-primary transition-colors">
                  <LuMessageSquare size={16} />
                </button>
                <button className="flex items-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 px-3 py-2.5 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 text-text-primary transition-colors">
                  <FiMoreHorizontal size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="pointer-events-auto">
          <h1 className="font-bold text-text-primary text-2xl md:text-3xl tracking-tight">
            {user.name}
          </h1>
          <p className="mt-1 text-text-secondary text-base md:text-lg">
            {user.headline}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-text-secondary text-sm">
            <div className="flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer">
              <LuMapPin size={16} />
              {user.location}
            </div>
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-primary hover:text-indigo-400 transition-colors"
            >
              <FaLink size={16} />
              {user.website.replace(/^https?:\/\//, "")}
            </a>
            <div className="flex items-center gap-1.5">
              <LuCalendar size={16} />
              Joined {user.joinedDate}
            </div>
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
              <div className="z-130 fixed inset-0 flex justify-center items-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 backdrop-blur-md"
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
                  alt="Preview"
                  className="z-(--z-raised) relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl max-w-full max-h-[90vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className="top-6 right-6 z-20 absolute bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
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
}
