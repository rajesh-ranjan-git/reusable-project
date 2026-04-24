import Image from "next/image";
import { LuCamera } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import { staticImagesConfig } from "@/config/common.config";
import { AvatarProps } from "@/types/props/profile.props.types";
import { getFullName } from "@/helpers/profile.helpers";
import ImageUploadMenu from "@/components/shared/image.upload.menu";

const Avatar = ({
  user,
  localAvatar,
  handleImagePreview,
  isImageUploading,
  currentImageTarget,
  isOwnProfile,
  activeMenu,
  setActiveMenu,
  handleUploadClick,
  handleCameraClick,
}: AvatarProps) => {
  return (
    <div className="group inline-block relative self-start md:self-auto pointer-events-auto">
      <Image
        src={
          localAvatar ? localAvatar : staticImagesConfig.avatarPlaceholder.src
        }
        alt={getFullName(user) ?? "User Cover"}
        width={400}
        height={400}
        className="z-(--z-base) relative bg-glass shadow-xl border-4 border-bg rounded-xl w-24 md:w-32 h-24 md:h-32 object-cover hover:scale-[1.02] transition-transform cursor-pointer"
        onClick={() =>
          handleImagePreview(
            localAvatar
              ? localAvatar
              : staticImagesConfig.avatarPlaceholder.src,
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
  );
};

export default Avatar;
