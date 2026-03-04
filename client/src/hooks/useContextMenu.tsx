"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/store";
import { UseContextMenuProps } from "@/types/propTypes";

const useContextMenu = ({ type }: UseContextMenuProps) => {
  const activeContextMenu = useAppStore((state) => state.activeContextMenu);
  const setActiveContextMenu = useAppStore(
    (state) => state.setActiveContextMenu,
  );

  const open = useCallback(
    () => setActiveContextMenu(type),
    [type, activeContextMenu],
  );

  const close = useCallback(
    () => setActiveContextMenu(null),
    [activeContextMenu],
  );

  const toggle = useCallback(() => {
    setActiveContextMenu(activeContextMenu === type ? null : type);
  }, [type, activeContextMenu, setActiveContextMenu]);

  const isOpen = activeContextMenu === type;

  return { open, close, toggle, isOpen };
};

export default useContextMenu;
