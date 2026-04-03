import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { IoBarChart } from "react-icons/io5";
import {
  LuFileText,
  LuLogOut,
  LuPanelLeft,
  LuPanelLeftClose,
  LuSettings,
  LuUsers,
} from "react-icons/lu";

export default function AdminSidebar({
  isMobileOpen,
  setMobileOpen,
}: {
  isMobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", icon: FaHome, path: "/admin" },
    { label: "Users", icon: LuUsers, path: "/admin/users" },
    { label: "Analytics", icon: IoBarChart, path: "/admin/analytics" },
    { label: "Reports", icon: LuFileText, path: "/admin/reports" },
    { label: "Settings", icon: LuSettings, path: "/admin/settings" },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="md:hidden z-40 fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-(--z-dropdown) bg-bg/95 backdrop-blur-md border-r border-white/10 flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex justify-between items-center px-4 border-white/10 border-b h-16">
          <Link
            href="/discover"
            className="flex items-center gap-2 overflow-hidden"
          >
            <div className="flex justify-center items-center bg-linear-to-br from-primary to-accent rounded-lg w-8 h-8 shrink-0">
              <span className="font-bold text-white text-xs">DM</span>
            </div>
            {!collapsed && (
              <span className="font-bold text-white text-lg tracking-tight whitespace-nowrap">
                Admin Panel
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1 text-text-secondary hover:text-white transition-colors"
          >
            {collapsed ? (
              <LuPanelLeft size={20} />
            ) : (
              <LuPanelLeftClose size={20} />
            )}
          </button>
        </div>

        <nav className="flex flex-col flex-1 gap-2 px-3 py-6 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.path ||
              (item.path === "/admin" &&
                pathname.startsWith("/admin") &&
                pathname === "/admin");
            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border ${
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "text-text-secondary border-transparent hover:text-white hover:bg-white/5"
                }`}
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} className={isActive ? "text-primary" : ""} />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-white/10 border-t">
          <button className="flex items-center gap-3 hover:bg-red-500/10 px-3 py-2 rounded-lg w-full overflow-hidden text-text-secondary hover:text-red-400 transition-colors">
            <LuLogOut size={20} className="shrink-0" />
            {!collapsed && (
              <span className="font-medium whitespace-nowrap">Sign Out</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
