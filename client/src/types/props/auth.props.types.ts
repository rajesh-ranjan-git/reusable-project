import { ElementType, ReactNode } from "react";
import { Variants } from "motion/react";
import { UseInputFieldValidatorReturnType } from "@/types/types/hook.types";

export interface AuthBannerProps {
  isLogin: boolean;
  handleToggleMode: () => void;
}

export interface RegisterFormProps {
  formVariants: Variants;
  emailInput: UseInputFieldValidatorReturnType<string>;
  firstNameInput: UseInputFieldValidatorReturnType<string>;
  lastNameInput: UseInputFieldValidatorReturnType<string>;
  passwordInput: UseInputFieldValidatorReturnType<string>;
  isPending: boolean;
  formAction: (payload: FormData) => void;
  handleProviderLogin: (provider: string) => void;
}

export interface LoginFormProps {
  formVariants: Variants;
  loginField: UseInputFieldValidatorReturnType<string>;
  passwordInput: UseInputFieldValidatorReturnType<string>;
  isPending: boolean;
  formAction: (payload: FormData) => void;
  handleProviderLogin: (provider: string) => void;
}

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export interface SocialButtonProps {
  provider: "Google" | "Facebook" | "GitHub" | "LinkedIn";
  onClick: () => void;
  icon: ElementType;
  iconOnly: boolean;
}
