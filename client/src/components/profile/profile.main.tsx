import Link from "next/link";
import { FaLink } from "react-icons/fa";
import { LuCalendar, LuMapPin } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { socialPlatformsConfig } from "@/config/profile.config";
import { ProfileMainProps } from "@/types/props/profile.props.types";
import { useAppStore } from "@/store/store";
import { getCurrentJobRole, getFullName } from "@/helpers/profile.helpers";
import { toTitleCase } from "@/utils/common.utils";
import { formatDate } from "@/utils/date.utils";

const ProfileMain = ({ isOwnProfile, userProfile }: ProfileMainProps) => {
  const setCurrentProfileForm = useAppStore(
    (state) => state.setCurrentProfileForm,
  );

  return (
    <div className="pointer-events-auto">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-shadow-accent-purple-dark text-shadow-lg font-alkatra font-extrabold">
          {getFullName(userProfile)}
        </h1>

        {userProfile?.nickName ? (
          <span className="text-text-muted text-base md:text-lg italic">
            &ldquo;{toTitleCase(userProfile.nickName)}&rdquo;
          </span>
        ) : null}

        {isOwnProfile && (
          <button
            type="button"
            className="relative flex-none group-hover:opacity-100 p-1.5 text-sm transition-opacity duration-200 btn btn-ghost"
            onClick={() => setCurrentProfileForm("basic")}
            aria-label="Edit Name"
          >
            <MdOutlineEdit size={16} />
          </button>
        )}
      </div>

      {userProfile?.userName && (
        <div className="flex gap-2">
          <p className="mt-0.5 text-text-muted text-sm">
            @{userProfile.userName}
          </p>

          {isOwnProfile && (
            <button
              type="button"
              className="relative flex-none group-hover:opacity-100 p-1 text-sm transition-opacity duration-200 btn btn-ghost"
              onClick={() => setCurrentProfileForm("username")}
              aria-label="Edit Username"
            >
              <MdOutlineEdit size={12} />
            </button>
          )}
        </div>
      )}

      {userProfile?.experiences?.length &&
      userProfile?.experiences?.length > 0 ? (
        <p className="mt-1 text-text-secondary text-base md:text-lg">
          {toTitleCase(
            getCurrentJobRole(userProfile?.experiences) ?? "No role",
          )}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text-secondary text-sm">
        {userProfile?.social && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pointer-events-auto">
            {socialPlatformsConfig.map(({ name, Icon, label }) => {
              const href =
                userProfile.social?.[
                  name as keyof NonNullable<typeof userProfile.social>
                ];
              if (!href) return null;
              return (
                <Link
                  key={name}
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
        {userProfile?.location && (
          <div className="flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer">
            <LuMapPin size={16} />
            {toTitleCase(userProfile.location)}
          </div>
        )}

        {userProfile?.social?.website && (
          <Link
            href={userProfile.social.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-primary hover:text-indigo-400 transition-colors"
          >
            <FaLink size={16} />
            {userProfile.social.website.replace(/^https?:\/\//, "")}
          </Link>
        )}

        {userProfile?.createdAt && (
          <div className="flex items-center gap-1.5">
            <LuCalendar size={16} />
            Joined on {formatDate(userProfile.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMain;
