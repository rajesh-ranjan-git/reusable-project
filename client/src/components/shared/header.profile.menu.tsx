import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FiCheckCircle } from "react-icons/fi";
import {
  LuCompass,
  LuCreditCard,
  LuLayoutDashboard,
  LuLogOut,
  LuMessageSquare,
  LuSettings,
  LuUser,
} from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { staticImagesConfig } from "@/config/common.config";
import { HeaderProfileMenuProps } from "@/types/props/common.props.types";
import { useAppStore } from "@/store/store";
import { toTitleCase } from "@/utils/common.utils";
import {
  adminRoutes,
  chatRoutes,
  defaultRoutes,
  profileRoutes,
  subscriptionRoutes,
} from "@/lib/routes/routes";
import { logoutAction } from "@/lib/actions/auth.actions";
import ProfileMenuItem from "@/components/shared/profile.menu.item";
import { getFullName } from "@/helpers/profile.helpers";

const profileMenuItems = {
  profile: {
    title: "View Profile",
    url: profileRoutes.profile,
    icon: <LuUser size={16} className="text-text-secondary" />,
  },
  about: {
    title: "About App",
    url: defaultRoutes.landing,
    icon: <IoHomeOutline size={16} className="text-text-secondary" />,
  },
  discover: {
    title: "Discover",
    url: defaultRoutes.discover,
    icon: <LuCompass size={16} className="text-text-secondary" />,
  },
  chats: {
    title: "Chats",
    url: chatRoutes.chat,
    icon: <LuMessageSquare size={16} className="text-text-secondary" />,
  },
  subscription: {
    title: "Subscription",
    url: subscriptionRoutes.subscription,
    icon: <LuCreditCard size={16} className="text-text-secondary" />,
  },
  settings: {
    id: "settings",
    title: "Account Settings",
    icon: <LuSettings size={16} className="text-text-secondary" />,
  },
};

const adminDashboardMenuItem = {
  dashboard: {
    title: "Admin Dashboard",
    url: adminRoutes.dashboard,
    icon: <LuLayoutDashboard size={16} className="text-text-secondary" />,
  },
};

const HeaderProfileMenu = ({
  isOpen,
  onClose,
  positionClass = "top-full right-0 mt-3",
}: HeaderProfileMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const loggedInUser = useAppStore((state) => state.loggedInUser);
  const setLoggedInUser = useAppStore((state) => state.setLoggedInUser);
  const setIsLoggingOut = useAppStore((state) => state.setIsLoggingOut);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside: EventListener = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }
      onClose();
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNavigation = (path: string) => {
    if (pathname !== path) router.push(path);
    onClose();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await logoutAction();

    setAccessToken(null);
    setLoggedInUser(null);

    router.push(defaultRoutes.landing);
    onClose();

    setTimeout(() => setIsLoggingOut(false), 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute ${positionClass} w-60 glass-heavy backdrop-blur-md z-(--z-dropdown) pt-1 flex flex-col overflow-hidden`}
        >
          <div className="flex items-center gap-3 mb-2 px-4 py-3 border-accent-purple-dark/30 border-b">
            <Image
              src={
                loggedInUser?.avatar
                  ? loggedInUser?.avatar
                  : staticImagesConfig.avatarPlaceholder.src
              }
              alt={
                loggedInUser
                  ? getFullName(loggedInUser)
                  : staticImagesConfig.avatarPlaceholder.alt
              }
              width={100}
              height={100}
              className="shadow-glass-bg shadow-md border border-glass-border hover:border-glass-border-accent rounded-full w-10 h-10 object-cover select-none"
            />

            <div className="min-w-0">
              <p className="font-semibold text-text-primary text-sm truncate">
                {getFullName(loggedInUser)}
              </p>
              {loggedInUser?.role && (
                <p className="flex items-center gap-1 mt-0.5 text-text-secondary text-xs">
                  <FiCheckCircle
                    size={12}
                    className="text-text-primary shrink-0"
                  />
                  <span className="truncate">
                    {toTitleCase(loggedInUser.role)}
                  </span>
                </p>
              )}
            </div>
          </div>

          <ul>
            {loggedInUser?.role.includes("ADMIN") && (
              <ProfileMenuItem
                item={adminDashboardMenuItem.dashboard}
                handleNavigation={handleNavigation}
              />
            )}

            {Object.entries(profileMenuItems).map(([key, item]) => (
              <ProfileMenuItem
                key={key}
                item={item}
                handleNavigation={handleNavigation}
              />
            ))}
          </ul>

          <hr className="mt-2 mb-0 text-text-secondary divider" />

          <ul>
            <li
              onClick={() => handleLogout()}
              className="flex justify-center items-center gap-2 hover:bg-status-error-bg px-4 py-1 w-full text-status-error-text text-left cursor-pointer"
            >
              <div className="mt-0.5 p-1.5 rounded-full">
                <LuLogOut size={16} />
              </div>
              <p className="text-status-error-text text-sm leading-snug">
                Sign Out
              </p>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderProfileMenu;
