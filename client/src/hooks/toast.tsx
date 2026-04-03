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
    bg: "bg-success-bg border-success-border backdrop-blur-2xl",
    text: "text-success-text-primary",
    icon: FiCheckCircle,
    iconColor: "text-success-text-primary",
    progress: "bg-success-text-primary",
  },
  error: {
    bg: "bg-error-bg border-error-border backdrop-blur-2xl",
    text: "text-error-text-primary",
    icon: FiAlertCircle,
    iconColor: "text-error-text-primary",
    progress: "bg-error-text-primary",
  },
  warning: {
    bg: "bg-warning border-warning-border backdrop-blur-2xl",
    text: "text-warning-text-primary",
    icon: TbAlertTriangle,
    iconColor: "text-warning-text-primary",
    progress: "bg-warning-text-primary",
  },
  info: {
    bg: "bg-info border-info-border backdrop-blur-2xl",
    text: "text-info-text-primary",
    icon: FaInfoCircle,
    iconColor: "text-info-text-primary",
    progress: "bg-info-text-primary",
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
      className={`relative w-80 ${config.bg} m-2 border rounded-lg shadow-lg overflow-hidden`}
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

      <div className="flex items-start gap-3 p-4">
        <Icon className={`${config.iconColor} shrink-0 mt-0.5`} size={20} />

        <div className="flex-1 min-w-0">
          <h3 className={`font-bold ${config.text} text-md mb-1`}>
            {toast.title}
          </h3>
          <p className={`${config.text} text-sm font-semibold opacity-90`}>
            {toast.message}
          </p>
        </div>

        <button
          onClick={() => {
            setShouldExit(true);
            setTimeout(() => onRemove(toast.id), 300);
          }}
          className={`${config.text} opacity-70 border border-border hover:opacity-100 transition-opacity shrink-0 cursor-pointer rounded-md`}
        >
          <IoClose size={18} />
        </button>
      </div>

      {toast.toastProgressPosition === "bottom" && (
        <div className="h-1">
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
      className={`fixed ${positionStyles[position]} z-(--z-dropdown) flex flex-col`}
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
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>(
    TOAST_POSITIONS.bottomRight,
  );

  const showToast = useCallback((config: ToastConfig) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      title: config.title,
      message: config.message,
      variant: config.variant || TOAST_VARIANTS.info,
      duration: config.duration || 3000,
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
