import { ApiErrorResponseType, ApiSuccessResponseType } from "./api.types";
import { ExperienceType } from "@/types/types/profile.types";

export type SectionErrorsType<T> = Partial<Record<keyof T, string>>;

export type FieldErrorsType = {
  userName?: string | null;
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  interests?: string | null;
  skills?: string | null;
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
