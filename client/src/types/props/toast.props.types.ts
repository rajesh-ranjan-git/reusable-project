import { ToastPositionType, ToastType } from "@/types/types/toast.types";

export interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
  index: number;
  position: ToastPositionType;
}
