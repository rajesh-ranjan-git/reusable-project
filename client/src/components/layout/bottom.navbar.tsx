import { useRouter } from "next/navigation";
import { LuCompass, LuMessageSquare, LuUser } from "react-icons/lu";
import { chatRoutes, defaultRoutes, profileRoutes } from "@/lib/routes/routes";

const BottomNavbar = ({ activeTab = "chats", hidden = false }) => {
  const router = useRouter();
  if (hidden) return null;

  const tabs = [
    {
      id: "discover",
      icon: LuCompass,
      label: "Discover",
      path: defaultRoutes.discover,
    },
    {
      id: "chats",
      icon: LuMessageSquare,
      label: "Chats",
      badge: 3,
      path: chatRoutes.chat,
    },
    {
      id: "profile",
      icon: LuUser,
      label: "Profile",
      path: profileRoutes.profile,
    },
  ];

  return (
    <div className="md:hidden right-0 bottom-0 left-0 z-(--z-sticky) fixed flex justify-between items-center glass-nav backdrop-blur-md px-6 pt-2 border-glass-border border-t">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.path)}
            className={`flex flex-col items-center gap-1 relative ${isActive ? "text-primary" : "text-text-secondary hover:text-text-primary transition-colors"}`}
          >
            <Icon size={24} className={isActive ? "fill-primary/20" : ""} />
            <span className="font-medium text-[10px]">{tab.label}</span>
            {tab.badge && (
              <span className="-top-1 -right-2 absolute flex justify-center items-center p-2 rounded-full w-6 h-6 text-xs alert alert-error">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
