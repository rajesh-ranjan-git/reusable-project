"use client";

import { MouseEvent, useState } from "react";
import Link from "next/link";
import { LuBell, LuMenu, LuSearch, LuX } from "react-icons/lu";
import ThemeToggle from "@/components/theme/themeToggle";
import AppSidebar from "@/components/layout/appSidebar";
import HeaderNotificationMenu from "@/components/shared/headerNotificationMenu";
import HeaderProfileMenu from "@/components/shared/headerProfileMenu";
import Image from "next/image";
import { staticImages } from "@/config/common.config";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  const toggleProfileMenu = (e: MouseEvent) => {
    e.stopPropagation();

    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }

    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationMenuOpen(false);
  };

  const toggleNotificationMenu = (e: MouseEvent) => {
    e.stopPropagation();

    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }

    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setIsProfileMenuOpen(false);
  };

  return (
    <>
      <header className="top-0 z-(--z-sticky) sticky flex justify-between items-center px-2 md:px-6 h-16 glass-nav">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden px-0 py-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            <LuMenu size={24} />
          </button>
          <Link href="/discover" className="group flex items-center gap-2">
            <Image
              src={staticImages.mainLogo.src}
              alt={staticImages.mainLogo.alt}
              width={100}
              height={100}
              className="shadow-glass-bg shadow-md rounded-full w-10 h-auto select-none"
            />
            <span className="font-tourney font-semibold text-gradient text-xl md:text-3xl tracking-tight">
              App Name
            </span>
          </Link>
        </div>

        <div className="hidden md:block relative flex-1 mx-6 max-w-md">
          <LuSearch className="top-1/2 left-3 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />

          <input
            type="search"
            className="pl-9"
            placeholder="Search developers, skills..."
          />
        </div>

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
      </header>

      <div
        className={`fixed inset-0 z-(--z-dropdown) backdrop-blur-sm transition-opacity duration-300 md:hidden ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-dvh w-72 sm:w-80 bg-[#0B0F1A] md:hidden z-(--z-toast) transition-transform duration-300 shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="top-2 right-2 z-(--z-toast) absolute">
          <button
            onClick={() => setIsSidebarOpen(false)}
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
  );
}
