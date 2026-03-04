import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { themeConfig } from "@/config/config";
import { ContextMenuTypes, SheetTypes, ThemeTypes } from "@/types/types";

type AppState = {
  activeTheme: ThemeTypes;
  setActiveTheme: Dispatch<SetStateAction<ThemeTypes>>;
  activeSheet: SheetTypes;
  setActiveSheet: Dispatch<SetStateAction<SheetTypes>>;
  activeContextMenu: ContextMenuTypes;
  setActiveContextMenu: Dispatch<SetStateAction<ContextMenuTypes>>;
};

export const useAppStore = create<AppState>((set) => ({
  activeTheme: themeConfig.dark,
  setActiveTheme: (themeOrUpdater) =>
    set((state) => ({
      activeTheme:
        typeof themeOrUpdater === "function"
          ? themeOrUpdater(state.activeTheme)
          : themeOrUpdater,
    })),

  activeSheet: null,
  setActiveSheet: (sheetOrUpdater) =>
    set((state) => ({
      activeSheet:
        typeof sheetOrUpdater === "function"
          ? sheetOrUpdater(state.activeSheet)
          : sheetOrUpdater,
    })),

  activeContextMenu: null,
  setActiveContextMenu: (contextMenuOrUpdater) =>
    set((state) => ({
      activeContextMenu:
        typeof contextMenuOrUpdater === "function"
          ? contextMenuOrUpdater(state.activeContextMenu)
          : contextMenuOrUpdater,
    })),
}));
