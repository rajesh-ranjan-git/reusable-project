"use client";

import { useEffect } from "react";
import { themeConfig } from "@/config/common.config";
import { useAppStore } from "@/store/store";

const ThemeManager = () => {
  const activeTheme = useAppStore((state) => state.activeTheme);

  useEffect(() => {
    if (!activeTheme) return;

    const isDark = activeTheme === themeConfig.dark;

    const root = document.documentElement;

    root.setAttribute("data-theme", isDark ? "dark" : "light");

    root.classList.toggle(themeConfig.dark, isDark);
    root.classList.toggle(themeConfig.light, !isDark);

    return () => {
      root.removeAttribute("data-theme");
      root.classList.remove(themeConfig.dark, themeConfig.light);
    };
  }, [activeTheme]);

  return null;
};

export default ThemeManager;
