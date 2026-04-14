import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { staticImages } from "@/config/common.config";
import { IoHomeOutline } from "react-icons/io5";
import {
  adminRoutes,
  chatRoutes,
  defaultRoutes,
  profileRoutes,
} from "@/lib/routes/routes";

type HeaderProfileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  positionClass?: string;
};

const HeaderProfileMenu = ({
  isOpen,
  onClose,
  positionClass = "top-full right-0 mt-3",
}: HeaderProfileMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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
    router.push(path);
    onClose();
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
              src={staticImages.avatarPlaceholder.src}
              alt={staticImages.avatarPlaceholder.alt}
              width={100}
              height={100}
              className="shadow-glass-bg shadow-md border border-glass-border hover:border-glass-border-accent rounded-full w-10 h-10 object-cover select-none"
            />

            <div className="min-w-0">
              <p className="font-semibold text-text-primary text-sm truncate">
                Rajesh Ranjan
              </p>
              <p className="flex items-center gap-1 mt-0.5 text-text-secondary text-xs">
                <FiCheckCircle
                  size={12}
                  className="text-text-primary shrink-0"
                />{" "}
                <span className="truncate">Pro Member</span>
              </p>
            </div>
          </div>

          <ul>
            <li
              onClick={() => handleNavigation(profileRoutes.profile)}
              className="flex items-center gap-3 hover:bg-glass-bg-subtle px-4 py-1 w-full text-left transition-colors"
            >
              <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                <LuUser size={16} className="text-text-secondary" />
              </div>
              <p className="text-text-primary text-sm leading-snug">
                View Profile
              </p>
            </li>
            <li
              onClick={() => handleNavigation(defaultRoutes.landing)}
              className="flex items-center gap-2 hover:bg-glass-bg-subtle px-4 py-1 w-full text-left transition-colors"
            >
              <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                <IoHomeOutline size={16} className="text-text-secondary" />
              </div>
              <p className="text-text-primary text-sm leading-snug">
                About App
              </p>
            </li>
            <li
              onClick={() => handleNavigation(defaultRoutes.discover)}
              className="flex items-center gap-3 hover:bg-glass-bg-subtle px-4 py-1 w-full text-left transition-colors"
            >
              <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                <LuCompass size={16} className="text-text-secondary" />
              </div>
              <p className="text-text-primary text-sm leading-snug">Discover</p>
            </li>
            <li
              onClick={() => handleNavigation(chatRoutes.chat)}
              className="flex items-center gap-3 hover:bg-glass-bg-subtle px-4 py-1 w-full text-left transition-colors"
            >
              <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                <LuMessageSquare size={16} className="text-text-secondary" />
              </div>
              <p className="text-text-primary text-sm leading-snug">Chats</p>
            </li>
            <li
              onClick={() => handleNavigation("/subscription")}
              className="flex items-center gap-3 hover:bg-glass-bg-subtle px-4 py-1 w-full text-left transition-colors"
            >
              <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                <LuCreditCard size={16} className="text-text-secondary" />
              </div>
              <p className="text-text-primary text-sm leading-snug">
                Subscriptions
              </p>
            </li>
            <li
              onClick={() => handleNavigation(adminRoutes.dashboard)}
              className="flex items-center gap-3 hover:bg-glass-bg-subtle px-4 py-1 w-full text-left transition-colors"
            >
              <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                <LuLayoutDashboard size={16} className="text-text-secondary" />
              </div>
              <p className="text-text-primary text-sm leading-snug">
                Admin Dashboard
              </p>
            </li>
            <li
              onClick={onClose}
              className="flex items-center gap-2 hover:bg-glass-bg-subtle px-4 py-1 w-full text-left transition-colors"
            >
              <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                <LuSettings size={16} className="text-text-secondary" />
              </div>
              <p className="text-text-primary text-sm leading-snug">
                Account Settings
              </p>
            </li>
          </ul>

          <hr className="mt-2 mb-0 text-text-secondary divider" />

          <ul>
            <li
              onClick={() => {
                router.push(defaultRoutes.landing);
                onClose();
              }}
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
