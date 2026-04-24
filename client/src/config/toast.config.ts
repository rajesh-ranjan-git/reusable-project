import { ToastPositionType } from "@/types/types/toast.types";
import { FaInfoCircle } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { TbAlertTriangle } from "react-icons/tb";

export const toastVariantsConfig = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
} as const;

export const toastPositionsConfig = {
  topLeft: "top-left",
  topRight: "top-right",
  topCenter: "top-center",
  bottomLeft: "bottom-left",
  bottomRight: "bottom-right",
  bottomCenter: "bottom-center",
} as const;

export const toastProgressPositionsConfig = {
  top: "top",
  bottom: "bottom",
} as const;

export const toastProgressDirectionConfig = {
  leftToRight: "left-to-right",
  rightToLeft: "right-to-left",
} as const;

export const variantConfig = {
  success: {
    cn: "alert-success",
    text: "text-status-success-text",
    icon: FiCheckCircle,
    iconColor: "text-status-success-text",
    progress: "bg-status-success-text",
  },
  error: {
    cn: "alert-error",
    text: "text-status-error-text",
    icon: FiAlertCircle,
    iconColor: "text-status-error-text",
    progress: "bg-status-error-text",
  },
  warning: {
    cn: "alert-warning",
    text: "text-status-warning-text",
    icon: TbAlertTriangle,
    iconColor: "text-status-warning-text",
    progress: "bg-status-warning-text",
  },
  info: {
    cn: "alert-info",
    text: "text-status-info-text",
    icon: FaInfoCircle,
    iconColor: "text-status-info-text",
    progress: "bg-status-info-text",
  },
};

export const positionStylesConfig: Record<ToastPositionType, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};
