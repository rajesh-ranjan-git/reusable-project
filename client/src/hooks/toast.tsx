"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { motion } from "motion/react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { TbAlertTriangle } from "react-icons/tb";
import { FaInfoCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import useScreenWidthCheck from "@/hooks/useScreenWidthCheck";

export const TOAST_VARIANTS = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
} as const;

export const TOAST_POSITIONS = {
  topLeft: "top-left",
  topRight: "top-right",
  topCenter: "top-center",
  bottomLeft: "bottom-left",
  bottomRight: "bottom-right",
  bottomCenter: "bottom-center",
} as const;

export const TOAST_PROGRESS_POSITIONS = {
  top: "top",
  bottom: "bottom",
} as const;

export const TOAST_PROGRESS_DIRECTIONS = {
  leftToRight: "left-to-right",
  rightToLeft: "right-to-left",
} as const;

type ToastVariant = keyof typeof TOAST_VARIANTS;
type ToastPosition = (typeof TOAST_POSITIONS)[keyof typeof TOAST_POSITIONS];
type ToastProgressPosition = keyof typeof TOAST_PROGRESS_POSITIONS;
type ToastProgressDirection =
  (typeof TOAST_PROGRESS_DIRECTIONS)[keyof typeof TOAST_PROGRESS_DIRECTIONS];

interface ToastConfig {
  title: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  toastProgressPosition?: ToastProgressPosition;
  toastProgressDirection?: ToastProgressDirection;
}

interface Toast extends ToastConfig {
  id: string;
  variant: ToastVariant;
  duration: number;
  toastProgressPosition: ToastProgressPosition;
  toastProgressDirection: ToastProgressDirection;
}

interface ToastContextType {
  toasts: Toast[];
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
  showToast: (config: ToastConfig) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const variantConfig = {
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

const positionStyles: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

const getAnimationVariants = (position: ToastPosition) => {
  const isLeft = position.includes("left");
  const isRight = position.includes("right");
  const isCenter = position.includes("center");

  let xValue = 0;
  if (isLeft) xValue = -100;
  if (isRight) xValue = 100;

  return {
    initial: {
      opacity: 0,
      x: isCenter ? 0 : xValue,
      y: 0,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      x: isCenter ? 0 : xValue,
      y: -10,
      scale: 0.95,
    },
  };
};

const ToastItem: React.FC<{
  toast: Toast;
  onRemove: (id: string) => void;
  index: number;
  position: ToastPosition;
}> = ({ toast, onRemove, index, position }) => {
  const [shouldExit, setShouldExit] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = variantConfig[toast.variant];
  const Icon = config.icon;

  useEffect(() => {
    const startTime = Date.now();
    const duration = toast.duration;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        setShouldExit(true);
        setTimeout(() => onRemove(toast.id), 300);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [toast.id, toast.duration, onRemove]);

  const isLeftToRight =
    toast.toastProgressDirection === TOAST_PROGRESS_DIRECTIONS.leftToRight;

  const progressContainerStyle = isLeftToRight
    ? { justifyContent: "flex-start" }
    : { justifyContent: "flex-end" };

  const animationVariants = getAnimationVariants(position);

  return (
    <motion.div
      layout
      initial="initial"
      animate={shouldExit ? "exit" : "animate"}
      exit="exit"
      variants={animationVariants}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 40,
        mass: 1,
      }}
      className={`${config.cn} relative backdrop-blur-sm min-w-80 max-w-84 md:max-w-96 overflow-hidden alert p-0`}
      style={{
        marginBottom: index > 0 ? "8px" : "0",
      }}
    >
      {toast.toastProgressPosition === "top" && (
        <div className="h-1" style={progressContainerStyle}>
          <motion.div
            className={`h-full ${config.progress}`}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      )}

      <div className="flex items-start gap-2 px-4 py-4">
        <Icon className={`${config.iconColor} alert-icon`} size={20} />

        <div>
          <p className="font-arima text-lg tracking-wider alert-title">
            {toast.title}
          </p>
          <p className={`${config.text} opacity-90 m-0 text-sm`}>
            {toast.message}
          </p>
        </div>

        <button
          onClick={() => {
            setShouldExit(true);
            setTimeout(() => onRemove(toast.id), 300);
          }}
          className={`${config.text} top-1 right-1 absolute opacity-50 hover:opacity-100 shadow-glass-bg hover:shadow-glass-bg-strong m-0 p-0 border border-status-error-border hover:border-status-error-text rounded-full transition-opacity`}
        >
          <IoClose size={18} />
        </button>
      </div>

      {toast.toastProgressPosition === "bottom" && (
        <div className="bottom-0 absolute rounded-full w-full h-1">
          <motion.div
            className={`h-full ${config.progress}`}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
};

const ToastContainer: React.FC<{
  toasts: Toast[];
  position: ToastPosition;
  onRemove: (id: string) => void;
}> = ({ toasts, position, onRemove }) => {
  return (
    <div
      className={`fixed ${positionStyles[position]} z-(--z-toast) flex flex-col`}
    >
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          index={index}
          position={position}
        />
      ))}
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isDesktopScreenWidth } = useScreenWidthCheck();

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>(
    TOAST_POSITIONS.topCenter,
  );

  const showToast = useCallback((config: ToastConfig) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      title: config.title,
      message: config.message,
      variant: config.variant || TOAST_VARIANTS.info,
      duration: config.duration || 1997,
      toastProgressPosition:
        config.toastProgressPosition || TOAST_PROGRESS_POSITIONS.bottom,
      toastProgressDirection:
        config.toastProgressDirection || TOAST_PROGRESS_DIRECTIONS.leftToRight,
    };

    setToasts((prev) => [newToast, ...prev]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    setPosition(
      isDesktopScreenWidth
        ? TOAST_POSITIONS.bottomRight
        : TOAST_POSITIONS.topCenter,
    );
  }, [isDesktopScreenWidth]);

  return (
    <ToastContext.Provider
      value={{ toasts, position, setPosition, showToast, removeToast }}
    >
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        onRemove={removeToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
