"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/store";
import { UseSheetProps } from "@/types/propTypes";

const useSheet = ({ type }: UseSheetProps) => {
  const activeSheet = useAppStore((state) => state.activeSheet);
  const setActiveSheet = useAppStore((state) => state.setActiveSheet);

  const open = useCallback(() => setActiveSheet(type), [type, activeSheet]);

  const close = useCallback(() => setActiveSheet(null), [activeSheet]);

  const toggle = useCallback(() => {
    setActiveSheet(activeSheet === type ? null : type);
  }, [type, activeSheet, setActiveSheet]);

  const isOpen = activeSheet === type;

  return { open, close, toggle, isOpen };
};

export default useSheet;
