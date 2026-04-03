import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { LuHeart, LuMessageSquare, LuUserPlus } from "react-icons/lu";

type HeaderNotificationMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  positionClass?: string;
};

export default function HeaderNotificationMenu({
  isOpen,
  onClose,
  positionClass = "top-full right-0 mt-3",
}: HeaderNotificationMenuProps) {
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

  const notifications = [
    {
      id: 1,
      type: "match",
      text: "Sarah matched with you!",
      time: "2m ago",
      icon: LuHeart,
      color: "text-pink-500",
      path: "/chat",
    },
    {
      id: 2,
      type: "message",
      text: "Marcus sent you a message",
      time: "1h ago",
      icon: LuMessageSquare,
      color: "text-blue-400",
      path: "/chat",
    },
    {
      id: 3,
      type: "request",
      text: "Alex wants to connect",
      time: "2h ago",
      icon: LuUserPlus,
      color: "text-primary",
      path: "/profile",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute ${positionClass} w-72 glass-heavy backdrop-blur-md z-(--z-dropdown) pt-1 flex flex-col overflow-hidden`}
        >
          <div className="mb-1 px-4 py-3 border-accent-purple-dark/30 border-b">
            <h4 className="font-poppins text-center">Notifications</h4>
          </div>

          <ul className="max-h-75 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <li
                    key={notification.id}
                    onClick={() => handleNavigation(notification.path)}
                    className="flex items-start gap-3 hover:bg-glass-bg-hover px-4 py-3 w-full text-left"
                  >
                    <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                      <Icon size={16} className={notification.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary text-sm leading-snug">
                        {notification.text}
                      </p>
                      <p className="mt-1 text-text-secondary text-xs">
                        {notification.time}
                      </p>
                    </div>
                  </li>
                );
              })
            ) : (
              <div className="px-4 py-6 text-text-secondary text-sm text-center">
                No new notifications
              </div>
            )}
          </ul>

          <div
            onClick={onClose}
            className="flex justify-center items-center gap-2 hover:bg-glass-bg-hover mt-1 px-4 py-1 border-accent-purple-dark/30 border-t w-full text-status-error-text text-left cursor-pointer"
          >
            <button className="w-full h-full text-text-secondary hover:text-text-primary text-xs leading-snug">
              Mark all as read
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
