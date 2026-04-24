import Image from "next/image";
import { LuCamera } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import { staticImagesConfig } from "@/config/common.config";
import { CoverProps } from "@/types/props/profile.props.types";
import { getFullName } from "@/helpers/profile.helpers";
import ImageUploadMenu from "@/components/shared/image.upload.menu";

const Cover = ({
  user,
  localCover,
  handleImagePreview,
  isImageUploading,
  currentImageTarget,
  isOwnProfile,
  activeMenu,
  setActiveMenu,
  handleUploadClick,
  handleCameraClick,
}: CoverProps) => {
  return (
    <div className="group relative bg-black rounded-t-2xl w-full h-32 md:h-48">
      <Image
        src={localCover ? localCover : staticImagesConfig.coverPlaceholder.src}
        alt={getFullName(user) ?? "User Cover"}
        width={1600}
        height={800}
        className="opacity-80 group-hover:opacity-60 rounded-t-2xl w-full h-full object-cover transition-opacity cursor-pointer"
        onClick={() =>
          handleImagePreview(
            localCover ? localCover : staticImagesConfig.coverPlaceholder.src,
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
  );
};

export default Cover;
