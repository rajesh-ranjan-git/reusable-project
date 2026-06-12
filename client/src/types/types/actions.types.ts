import {
  ApiErrorResponseType,
  ApiSuccessResponseType,
} from "@/types/types/api.types";
import { ExperienceType } from "@/types/types/profile.types";

export type SectionErrorsType<T> = Partial<Record<keyof T, string>>;

export type FieldErrorsType = {
  userName?: string | null;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  token?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  nickName?: string | null;
  phone?: string | null;
  dob?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  bio?: string | null;
  interests?: string | null;
  skills?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  github?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  website?: string | null;
  experiences?: SectionErrorsType<ExperienceType>[];
};

export type FormStateType<T = any> =
  | (ApiSuccessResponseType<T> & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: never;
    })
  | (ApiErrorResponseType<T> & {
      inputs?: Record<string, FormDataEntryValue>;
      errors?: FieldErrorsType;
    });
