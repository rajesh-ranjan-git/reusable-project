"use client";

import { motion, AnimatePresence } from "motion/react";
import { FormErrorMessageProps } from "@/types/propTypes";

const FormErrorMessage = ({ errors, className }: FormErrorMessageProps) => {
  return (
    <AnimatePresence>
      {errors &&
        errors?.map((error, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`mx-5 mt-2 overflow-hidden text-red-400 text-sm origin-top ${className}`}
          >
            {error}
          </motion.p>
        ))}
    </AnimatePresence>
  );
};

export default FormErrorMessage;
