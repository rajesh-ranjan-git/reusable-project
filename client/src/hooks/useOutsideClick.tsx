"use client";

import { RefObject, useEffect, useRef } from "react";
import { UseOutsideClickProps } from "@/types/propTypes";

const useOutsideClick = ({ ref, when, callback }: UseOutsideClickProps) => {
  const savedCallback = useRef(callback);

  const refs = (Array.isArray(ref) ? ref : [ref]).filter(
    (r): r is RefObject<HTMLElement> => !!r
  );

  const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
    const target = event?.target as Node;

    const clickedInside = refs.some((r) => {
      const el = r?.current;
      return el && el?.contains(target);
    });

    if (!clickedInside) {
      savedCallback.current();
    }
  };

  useEffect(() => {
    if (when) {
      document.addEventListener("click", handleOutsideClick);

      return () => document.removeEventListener("click", handleOutsideClick);
    }
  }, [when]);

  useEffect(() => {
    savedCallback.current = callback;
  });
};

export default useOutsideClick;
