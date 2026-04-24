import {
  toastPositionsConfig,
  toastProgressDirectionConfig,
  toastProgressPositionsConfig,
  toastVariantsConfig,
} from "@/config/toast.config";

export type ToastVariantType = keyof typeof toastVariantsConfig;
export type ToastPositionType =
  (typeof toastPositionsConfig)[keyof typeof toastPositionsConfig];
export type ToastProgressPositionType =
  keyof typeof toastProgressPositionsConfig;
export type ToastProgressDirectionType =
  (typeof toastProgressDirectionConfig)[keyof typeof toastProgressDirectionConfig];

export type ToastConfigType = {
  title: string;
  message: string;
  variant?: ToastVariantType;
  duration?: number;
  toastProgressPosition?: ToastProgressPositionType;
  toastProgressDirection?: ToastProgressDirectionType;
};

export type ToastType = {
  id: string;
  variant: ToastVariantType;
  duration: number;
  toastProgressPosition: ToastProgressPositionType;
  toastProgressDirection: ToastProgressDirectionType;
} & ToastConfigType;

export type ToastContextType = {
  toasts: ToastType[];
  position: ToastPositionType;
  setPosition: (position: ToastPositionType) => void;
  showToast: (config: ToastConfigType) => void;
  removeToast: (id: string) => void;
};
