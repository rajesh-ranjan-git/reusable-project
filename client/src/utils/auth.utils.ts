import { Variants } from "motion/react";

export const getFormVariants = (isLogin: boolean): Variants => {
  return {
    hidden: { opacity: 0, x: isLogin ? 50 : -50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4 } },
  };
};
