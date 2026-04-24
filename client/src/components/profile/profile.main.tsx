import Link from "next/link";
import { FaLink } from "react-icons/fa";
import { LuCalendar, LuMapPin } from "react-icons/lu";
import { socialPlatformsConfig } from "@/config/profile.config";
import { ProfileMainProps } from "@/types/props/profile.props.types";
import { getCurrentJobRole, getFullName } from "@/helpers/profile.helpers";
import { toTitleCase } from "@/utils/common.utils";
import { getDateToShow } from "@/utils/date.utils";

const ProfileMain = ({ user }: ProfileMainProps) => {
  return (
    <div className="pointer-events-auto">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="font-arima font-extrabold">{getFullName(user)}</h1>

        {user?.nickName ? (
          <span className="text-text-muted text-base md:text-lg italic">
            &ldquo;{toTitleCase(user.nickName)}&rdquo;
          </span>
        ) : null}
      </div>

      {user?.userName && (
        <p className="mt-0.5 text-text-muted text-sm">@{user.userName}</p>
      )}

      {user?.experiences?.length && user?.experiences?.length > 0 ? (
        <p className="mt-1 text-text-secondary text-base md:text-lg">
          {toTitleCase(getCurrentJobRole(user?.experiences) ?? "No role")}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text-secondary text-sm">
        {user?.social && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pointer-events-auto">
            {socialPlatformsConfig.map(({ name, Icon, label }) => {
              const href =
                user.social?.[name as keyof NonNullable<typeof user.social>];
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
  );
};

export default ProfileMain;
