import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import {
  ExperienceType,
  SocialType,
  UserProfileType,
} from "@/types/types/profile.types";
import {
  DateRangeType,
  FormRadioOptionType,
  FormSelectOptionType,
} from "@/types/types/forms.types";

export interface BasicInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Pick<UserProfileType, "firstName" | "lastName" | "nickName">;
  onSave: (
    data: Pick<UserProfileType, "firstName" | "lastName" | "nickName">,
  ) => void;
}

export interface UsernameFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string;
  onSave: (username: string) => void;
}

export interface SocialLinksFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SocialType;
  onSave: (social: SocialType) => void;
}

export interface EmailFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string;
  onSave: (email: string) => void;
}

export interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export interface PhoneFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string;
  onSave: (phone: string) => void;
}

export interface GenderFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string | null;
  onSave: (gender: string) => void;
}

export interface DobFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string | null;
  joined?: string | null;
  onSave: (dob: string) => void;
}

export interface RelationshipFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string | null;
  onSave: (maritalStatus: string) => void;
}

export interface BioFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string;
  onSave: (bio: string) => void;
}

export interface ExperienceFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ExperienceType[];
  joined?: string | null;
  onSave: (experiences: ExperienceType[]) => void;
}

export interface FormLabelProps {
  htmlFor?: string;
  className?: string;
  children: ReactNode;
  required?: boolean;
}

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  error?: string;
  numericOnly?: boolean;
  maxDigits?: number;
}

export interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
}

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export interface FormSelectProps {
  options: FormSelectOptionType[];
  id: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export interface FormFieldProps {
  label?: string | ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export interface FormCheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  error?: string;
}

export interface FormRadioGroupProps {
  name: string;
  options: FormRadioOptionType[];
  value?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  layout?: "vertical" | "horizontal";
}

export interface CalendarGridProps {
  viewYear: number;
  viewMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  renderDay: (date: Date, dayNum: number) => ReactNode;
}

export interface FormDatePickerProps {
  id: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export interface FormDateRangePickerProps {
  value?: DateRangeType;
  onChange?: (range: DateRangeType) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export interface FormFooterProps {
  formType: string;
  onClose: () => void;
  isPending: boolean;
  isDisabled: boolean;
}

export interface FormErrorMessageProps {
  error: string | null;
  className?: string;
}

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}
