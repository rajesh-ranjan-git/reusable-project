import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LuHeart, LuMessageCircle, LuUserPlus } from "react-icons/lu";
import { HeaderNotificationMenuProps } from "@/types/props/common.props.types";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { conversationRoutes, profileRoutes } from "@/lib/routes/routes";

const HeaderNotificationMenu = ({
  isOpen,
  onClose,
  positionClass = "top-full right-0 rounded-md mt-2",
}: HeaderNotificationMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useOutsideClick({
    ref: menuRef,
    when: isOpen,
    callback: onClose,
    defer: true,
  });

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
      path: conversationRoutes.conversation,
    },
    {
      id: 2,
      type: "message",
      text: "Marcus sent you a message",
      time: "1h ago",
      icon: LuMessageCircle,
      color: "text-blue-400",
      path: conversationRoutes.conversation,
    },
    {
      id: 3,
      type: "request",
      text: "Alex wants to connect",
      time: "2h ago",
      icon: LuUserPlus,
      color: "text-primary",
      path: `${profileRoutes.profile}`,
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

          <ul className="max-h-75 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <li
                    key={notification.id}
                    onClick={() => handleNavigation(notification.path)}
                    className="flex items-start gap-3 hover:bg-glass-bg-subtle px-4 py-3 w-full text-left cursor-pointer select-none"
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

          <button
            onClick={onClose}
            className="flex justify-center items-center gap-2 hover:bg-glass-bg-subtle mt-1 px-4 py-2 border-accent-purple-dark/30 border-t w-full text-text-secondary hover:text-text-primary text-xs cursor-pointer"
          >
            Mark all as read
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderNotificationMenu;
