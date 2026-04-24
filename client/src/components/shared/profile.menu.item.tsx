import { ReactNode } from "react";

export interface ProfileMenuItemProps {
  item: {
    title: string;
    url?: string;
    icon: ReactNode;
  };
  handleNavigation: (url: string) => void;
}

const ProfileMenuItem = ({ item, handleNavigation }: ProfileMenuItemProps) => {
  return (
    <li
      onClick={() => handleNavigation(item.url ?? "")}
      className="flex items-center gap-3 hover:bg-glass-bg-subtle px-4 py-1 w-full text-left transition-colors"
    >
      <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
        {item.icon}
      </div>
      <p className="text-text-primary text-sm leading-snug">{item.title}</p>
    </li>
  );
};

export default ProfileMenuItem;
