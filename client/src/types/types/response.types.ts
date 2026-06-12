import { LoggedInUserType } from "@/types/types/auth.types";
import { UserProfileType } from "@/types/types/profile.types";

export type ResponsePaginationType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchMeResponseType = {
  user: LoggedInUserType;
};

export type RefreshResponseType = {
  accessToken: string;
};

export type VerifyEmailResponseType = {
  email: string;
};

export type ProfileResponseType = {
  user: UserProfileType;
};

export type ProfilesResponseType = {
  users: UserProfileType[];
  pagination: ResponsePaginationType;
};

export type UploadImageResponseType = {
  id: string;
  avatar: string;
};
