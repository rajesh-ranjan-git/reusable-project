import { Dispatch, SetStateAction } from "react";
import { ThemeType } from "@/types/types/common.types";
import { LoggedInUserType } from "@/types/types/auth.types";

export type AppStateType = {
  activeTheme: ThemeType;
  setActiveTheme: Dispatch<SetStateAction<ThemeType>>;
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  loggedInUser: LoggedInUserType;
  setLoggedInUser: Dispatch<SetStateAction<LoggedInUserType>>;
  isLoggingOut: boolean;
  setIsLoggingOut: Dispatch<SetStateAction<boolean>>;
};
