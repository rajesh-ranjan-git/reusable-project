"use client";

import { motion, AnimatePresence } from "motion/react";
import { FormErrorMessageProps } from "@/types/propTypes";

const FormErrorMessage = ({ error, className }: FormErrorMessageProps) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`my-1 overflow-hidden text-status-error-text text-xs origin-top ${className}`}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

export default FormErrorMessage;
