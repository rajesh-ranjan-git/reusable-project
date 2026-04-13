import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themeConfig } from "@/config/common.config";
import { ThemeTypes } from "@/types/types";

type AppState = {
  activeTheme: ThemeTypes;
  setActiveTheme: Dispatch<SetStateAction<ThemeTypes>>;
  loggedInUserId: string | null;
  setLoggedInUserId: Dispatch<SetStateAction<string | null>>;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeTheme: themeConfig.dark,
      setActiveTheme: (themeOrUpdater) =>
        set((state) => ({
          activeTheme:
            typeof themeOrUpdater === "function"
              ? themeOrUpdater(state.activeTheme)
              : themeOrUpdater,
        })),
      loggedInUserId: null,
      setLoggedInUserId: (loggedInUserIdUpdater) =>
        set((state) => ({
          loggedInUserId:
            typeof loggedInUserIdUpdater === "function"
              ? loggedInUserIdUpdater(state.loggedInUserId)
              : loggedInUserIdUpdater,
        })),
    }),
    {
      name: "app-storage",
      version: 1,
      partialize: (state) => ({
        activeTheme: state.activeTheme,
        loggedInUserId: state.loggedInUserId,
      }),
    },
  ),
);
