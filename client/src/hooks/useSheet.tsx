"use client";

import { useCallback, useState } from "react";
import { UseSheetProps } from "@/types/props/hooks.props.types";

const useSheet = ({ type }: UseSheetProps) => {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  const open = useCallback(() => setActiveSheet(type), [type]);

  const close = useCallback(() => setActiveSheet(null), []);

  const toggle = useCallback(() => {
    setActiveSheet(activeSheet === type ? null : type);
  }, [type, activeSheet, setActiveSheet]);

  const isOpen = activeSheet === type;

  return { open, close, toggle, isOpen };
};

export default useSheet;
