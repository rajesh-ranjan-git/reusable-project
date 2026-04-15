import { Dispatch, SetStateAction } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { IoBarChart } from "react-icons/io5";
import {
  LuFileText,
  LuLogOut,
  LuPanelLeft,
  LuPanelLeftClose,
  LuSettings,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { staticImages } from "@/config/common.config";
import { adminRoutes, defaultRoutes } from "@/lib/routes/routes";
import { AdminSidebarProps } from "@/types/propTypes";

const AdminSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  collapsed,
  setCollapsed,
}: AdminSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", icon: FaHome, path: adminRoutes.dashboard },
    { label: "Users", icon: LuUsers, path: adminRoutes.users },
    { label: "Analytics", icon: IoBarChart, path: adminRoutes.analytics },
    { label: "Reports", icon: LuFileText, path: adminRoutes.reports },
    { label: "Settings", icon: LuSettings, path: adminRoutes.settings },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-(--z-modal) backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-(--z-modal) flex flex-col border-glass-border border-r border-b-0 glass-nav transition-all duration-500
        ${collapsed ? "w-18" : "w-64"}
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="relative flex justify-between items-center px-4 border-glass-border border-b h-16">
          {!collapsed && (
            <Link
              href={adminRoutes.dashboard}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="flex justify-center items-center rounded-full w-8 h-8 shrink-0">
                <Image
                  src={staticImages.mainLogo.src}
                  alt={staticImages.mainLogo.alt}
                  width={100}
                  height={100}
                  className="shadow-glass-bg shadow-md rounded-full w-10 h-auto select-none"
                />
              </div>
              <h2 className="font-poppins md:text-xl text-nowrap">
                Admin Panel
              </h2>
              <div className="md:hidden top-1/4 right-2 z-(--z-toast) absolute">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="bg-glass-bg-strong p-1 border border-glass-border hover:border-glass-border-accent rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                >
                  <LuX size={20} />
                </button>
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            {collapsed ? (
              <div className="p-1">
                <LuPanelLeft size={20} />
              </div>
            ) : (
              <LuPanelLeftClose size={20} />
            )}
          </button>
        </div>

        <nav className="flex flex-col flex-1 gap-2 px-3 py-6 overflow-y-auto">
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
                className={`grid grid-cols-[auto_1fr] items-center gap-3 transition-all border p-3 ${
                  collapsed ? "rounded-full" : "rounded-lg"
                } ${
                  isActive
                    ? "bg-glass-bg-strong text-text-primary border-glass-border glass"
                    : "text-text-secondary border-transparent hover:text-text-primary hover:bg-glass-bg-hover"
                }`}
                title={collapsed ? item.label : undefined}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={20} className="self-center shrink-0" />
                {!collapsed && (
                  <span className="font-medium leading-none whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-2 border-glass-border border-t">
          <button
            className={`group flex justify-center items-center gap-3 hover:bg-status-error-bg p-2 border border-transparent hover:border-status-error-border overflow-hidden text-text-secondary hover:text-status-error-text transition-colors ${collapsed ? "rounded-full w-max" : "rounded-lg w-full"}`}
            onClick={() => router.push(defaultRoutes.landing)}
          >
            <LuLogOut size={20} className="group-hover:scale-110 shrink-0" />
            {!collapsed && (
              <span className="font-medium whitespace-nowrap group-hover:scale-105">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
