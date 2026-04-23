"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { LuX } from "react-icons/lu";

type ModalPortalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
};

const ModalPortal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-xl",
}: ModalPortalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              scale: 0.9,
              opacity: 0,
              transition: { duration: 0.15 },
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`
              relative w-full ${maxWidth} max-h-[92dvh] sm:max-h-[88dvh]
              flex flex-col
              rounded-t-3xl sm:rounded-3xl
              glass-heavy
              overflow-hidden
            `}
          >
            <div className="bg-(image:--gradient-brand-vivid) w-full h-0.75 shrink-0" />

            <div className="flex justify-between items-start gap-4 px-4 sm:px-6 pt-4 sm:pt-5 pb-4 border-glass-border border-b shrink-0">
              <div>
                <h4 className="font-semibold text-text-primary leading-tight">
                  {title}
                </h4>
                {subtitle && (
                  <p className="mt-0.5 text-text-muted text-xs">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex justify-center items-center p-1 rounded-full text-text-secondary hover:text-text-primary hover:scale-105 transition-transform shrink-0 glass"
              >
                <LuX size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-5 px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto">
              {children}
            </div>

            {footer && (
              <div className="flex justify-end items-center gap-3 px-6 py-4 border-glass-border border-t shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ModalPortal;
