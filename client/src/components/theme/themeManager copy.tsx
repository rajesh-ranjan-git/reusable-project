"use client";

import { useEffect } from "react";
import { themeConfig } from "@/config/common.config";
import { ThemeTypes } from "@/types/types";
import { useWebStorage } from "@/hooks/useWebStorage";
import { useAppStore } from "@/store/store";

const ThemeManager = () => {
  const [storedValue, setWebStorageValue] = useWebStorage<ThemeTypes>({
    key: "activeTheme",
    value: themeConfig.dark,
  });

  const activeTheme = useAppStore((state) => state.activeTheme);
  const setActiveTheme = useAppStore((state) => state.setActiveTheme);

  useEffect(() => {
    if (storedValue && storedValue !== activeTheme) {
      setActiveTheme(storedValue);
    }
  }, []);

  useEffect(() => {
    const isDark = activeTheme === themeConfig.dark;

    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );

    document.documentElement.classList.toggle(themeConfig.dark, isDark);
    document.documentElement.classList.toggle(themeConfig.light, !isDark);

    if (storedValue !== activeTheme) {
      setWebStorageValue(activeTheme);
    }

    return () => {
      document.documentElement.removeAttribute("data-theme");

      document.documentElement.classList.remove(
        themeConfig.dark,
        themeConfig.light,
      );
    };
  }, [activeTheme]);

  return null;
};

export default ThemeManager;
