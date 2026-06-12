import { Dispatch, ElementType, SetStateAction } from "react";

export interface AdminProps {
  params: { type: string };
}

export interface AdminPageProps {
  type: string;
}

export interface AdminSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export interface StatCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: ElementType;
}
