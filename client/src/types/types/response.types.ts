import { LoggedInUserType } from "@/types/types/auth.types";
import { UserProfileType } from "@/types/types/profile.types";

export type FetchMeResponseType = {
  user: LoggedInUserType;
};

export type RefreshResponseType = {
  accessToken: string;
};

export type ProfileResponseType = {
  user: UserProfileType;
};

export type ProfilesResponseType = {
  users: UserProfileType[];
};
