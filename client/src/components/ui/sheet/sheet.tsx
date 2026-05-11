import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ImCross } from "react-icons/im";
import { SheetProps } from "@/types/props/hooks.props.types";

const Sheet = ({ open, onClose, children }: SheetProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!isVisible) return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-(--z-modal) transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`top-0 right-0 z-(--z-modal) fixed bg-glass-bg backdrop-blur-sm p-2 border border-glass-border rounded-l-md min-w-96 h-screen overflow-hidden font-semibold text-glass-text-primary text-2xl transition-transform duration-500 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="top-2 right-2 absolute opacity-50 hover:opacity-100 p-1 border border-glass-border hover:border-glass-border-accent rounded-md text-sm transition-all ease-in-out cursor-pointer"
          onClick={onClose}
        >
          <ImCross size={10} />
        </div>
        {children || "Sheet"}
      </div>
    </>,
    document.body,
  );
};

export default Sheet;
