import { ToastPositionType } from "@/types/types/toast.types";

export const getAnimationVariants = (position: ToastPositionType) => {
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
