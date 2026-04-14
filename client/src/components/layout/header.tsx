"use client";

import { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuBell, LuMenu, LuSearch, LuX } from "react-icons/lu";
import { staticImages } from "@/config/common.config";
import ThemeToggle from "@/components/theme/themeToggle";
import AppSidebar from "@/components/layout/appSidebar";
import HeaderNotificationMenu from "@/components/shared/headerNotificationMenu";
import HeaderProfileMenu from "@/components/shared/headerProfileMenu";
import { HeaderProps } from "@/types/propTypes";
import { adminRoutes, authRoutes, defaultRoutes } from "@/lib/routes/routes";
import { usePathname } from "next/navigation";
import { toTitleCase } from "@/utils/common.utils";

const Header = ({ type, isSidebarOpen, setIsSidebarOpen }: HeaderProps) => {
  const [currentAdminPath, setCurrentAdminPath] = useState<string | null>(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  const pathname = usePathname();

  const toggleProfileMenu = (e: MouseEvent) => {
    e.stopPropagation();

    if (isSidebarOpen && setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }

    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationMenuOpen(false);
  };

  const toggleNotificationMenu = (e: MouseEvent) => {
    e.stopPropagation();

    if (isSidebarOpen && setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }

    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    if (type === "admin") {
      setCurrentAdminPath(toTitleCase(pathname.split("/")[2]));
    }
  }, [pathname]);

  return (
    <>
      <header
        className={`top-0 right-0 left-0 z-(--z-sticky) flex justify-between items-center px-2 md:px-6 backdrop-blur-sm h-16 glass-nav ${type === "landing" ? "fixed px-4 md:px-16 md:h-20" : "sticky"}`}
      >
        <div className="flex items-center gap-2 md:gap-4">
          {type !== "landing" && (
            <button
              onClick={
                setIsSidebarOpen ? () => setIsSidebarOpen(true) : () => {}
              }
              className="md:hidden px-0 py-1 text-text-secondary hover:text-text-primary transition-colors"
            >
              <LuMenu size={24} />
            </button>
          )}

          {type === "admin" ? (
            <Link
              href={adminRoutes.dashboard}
              className="group flex items-center gap-2"
            >
              <h1 className="pt-1.5 font-arima md:text-3xl">
                {currentAdminPath}
              </h1>
            </Link>
          ) : (
            <Link
              href={defaultRoutes.discover}
              className="group flex items-center gap-2"
            >
              <Image
                src={staticImages.mainLogo.src}
                alt={staticImages.mainLogo.alt}
                width={100}
                height={100}
                className={`shadow-glass-bg shadow-md rounded-full w-10 select-none ${type === "landing" ? "md:w-12 md:h-12" : ""}`}
              />
              <span className="font-tourney font-semibold text-gradient text-xl md:text-3xl text-nowrap tracking-tight">
                App Name
              </span>
            </Link>
          )}
        </div>

        {type === "landing" ? (
          <nav className="hidden lg:flex items-center gap-4">
            <Link
              href="#features"
              className="text-sm transition-colors ease-in-out btn btn-ghost"
            >
              Features
            </Link>
            <Link
              href="#community"
              className="text-sm transition-colors ease-in-out btn btn-ghost"
            >
              Community
            </Link>
            <Link
              href="/subscription"
              className="text-sm transition-colors ease-in-out btn btn-ghost"
            >
              Subscription
            </Link>
          </nav>
        ) : (
          <div className="hidden md:block relative flex-1 mx-6 max-w-md">
            <LuSearch className="top-1/2 left-3 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />

            <input
              type="search"
              className="pl-9"
              placeholder={
                type === "admin"
                  ? "Search stats, users..."
                  : "Search developers, skills..."
              }
            />
          </div>
        )}

        {type === "landing" ? (
          <div className="flex items-center gap-2">
            <span className="hidden md:flex shadow-md badge badge-blue">
              v1.0
            </span>

            <ThemeToggle />

            <Link href={authRoutes.login} className="text-sm btn btn-secondary">
              Log in
            </Link>

            <Link
              href={defaultRoutes.discover}
              className="hidden md:block text-text-on-accent text-sm btn btn-primary"
            >
              Open App
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 md:gap-4">
            <ThemeToggle />

            <div className="relative">
              <button
                onClick={toggleNotificationMenu}
                className={`hover:text-text-primary glass transition-colors relative p-1.5 rounded-lg ${isNotificationMenuOpen ? "text-text-primary" : "text-text-secondary"}`}
              >
                <LuBell size={20} />
                <span className="top-1.5 right-1.5 absolute bg-red-500 border border-bg rounded-full w-2 h-2"></span>
              </button>

              <HeaderNotificationMenu
                isOpen={isNotificationMenuOpen}
                onClose={() => setIsNotificationMenuOpen(false)}
              />
            </div>

            <div className="relative pt-1 md:pt-0">
              <button
                onClick={toggleProfileMenu}
                className={`relative w-10 h-10 rounded-full glass overflow-hidden border transition-all shadow-md focus:outline-none focus:ring-1 focus:ring-accent-purple-dark z-(--z-raised) ${isProfileMenuOpen ? "border-accent-purple-dark" : "border-glass-border hover:border-glass-border-accent"}`}
              >
                <Image
                  src={staticImages.avatarPlaceholder.src}
                  alt={staticImages.avatarPlaceholder.alt}
                  fill
                  sizes="2.5rem"
                  className="shadow-glass-bg shadow-md rounded-full w-full h-full object-cover select-none"
                />
              </button>

              <HeaderProfileMenu
                isOpen={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </header>

      {type === "default" && (
        <>
          <div
            className={`fixed inset-0 z-(--z-dropdown) backdrop-blur-sm transition-opacity duration-300 md:hidden ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={
              setIsSidebarOpen ? () => setIsSidebarOpen(false) : () => {}
            }
          />

          {isSidebarOpen && (
            <div
              className="md:hidden fixed inset-0 z-(--z-modal) backdrop-blur-sm"
              onClick={
                setIsSidebarOpen ? () => setIsSidebarOpen(false) : () => {}
              }
            />
          )}

          <div
            className={`fixed top-0 left-0 h-dvh w-72 sm:w-80 bg-[#0B0F1A] md:hidden z-(--z-toast) transition-transform duration-300 shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="top-2 right-2 z-(--z-toast) absolute">
              <button
                onClick={
                  setIsSidebarOpen ? () => setIsSidebarOpen(false) : () => {}
                }
                className="bg-glass-bg-strong p-1 border border-glass-border hover:border-glass-border-accent rounded-lg text-text-secondary hover:text-text-primary transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>

            <div className="w-full h-full overflow-hidden">
              <AppSidebar setIsSidebarOpen={setIsSidebarOpen} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
