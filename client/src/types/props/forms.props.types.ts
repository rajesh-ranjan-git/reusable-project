import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { ExperienceType } from "@/types/types/profile.types";
import {
  DateRangeType,
  FormRadioOptionType,
  FormSelectOptionType,
} from "@/types/types/form.types";

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
  onSave: (experiences: ExperienceType[]) => Promise<void>;
}

export interface FormLabelProps {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
}

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  error?: string;
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
  label?: string;
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
  value?: string;
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
