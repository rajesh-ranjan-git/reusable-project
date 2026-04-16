import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themeConfig } from "@/config/common.config";
import { LoggedInUserType, ThemeTypes } from "@/types/types";

type AppState = {
  activeTheme: ThemeTypes;
  setActiveTheme: Dispatch<SetStateAction<ThemeTypes>>;
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  loggedInUser: LoggedInUserType;
  setLoggedInUser: Dispatch<SetStateAction<LoggedInUserType>>;
  isLoggingOut: boolean;
  setIsLoggingOut: Dispatch<SetStateAction<boolean>>;
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
      accessToken: null,
      setAccessToken: (accessTokenUpdater) =>
        set((state) => ({
          accessToken:
            typeof accessTokenUpdater === "function"
              ? accessTokenUpdater(state.accessToken)
              : accessTokenUpdater,
        })),
      loggedInUser: null,
      setLoggedInUser: (loggedInUserUpdater) =>
        set((state) => ({
          loggedInUser:
            typeof loggedInUserUpdater === "function"
              ? loggedInUserUpdater(state.loggedInUser)
              : loggedInUserUpdater,
        })),
      isLoggingOut: false,
      setIsLoggingOut: (isLoggingOutUpdater) =>
        set((state) => ({
          isLoggingOut:
            typeof isLoggingOutUpdater === "function"
              ? isLoggingOutUpdater(state.isLoggingOut)
              : isLoggingOutUpdater,
        })),
    }),
    {
      name: "app-storage",
      version: 1,
      partialize: (state) => ({
        activeTheme: state.activeTheme,
        accessToken: state.accessToken,
        loggedInUser: state.loggedInUser,
      }),
    },
  ),
);
