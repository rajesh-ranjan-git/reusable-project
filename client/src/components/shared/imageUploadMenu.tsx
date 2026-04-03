import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LuCamera, LuTrash2, LuUpload } from "react-icons/lu";

type ImageUploadMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  positionClass: string;
  onUploadClick: () => void;
  onCameraClick: () => void;
};

export default function ImageUploadMenu({
  isOpen,
  onClose,
  onUploadClick,
  onCameraClick,
  positionClass = "top-full right-0 mt-2",
}: ImageUploadMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside: EventListener = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }
      onClose();
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute ${positionClass} w-52 bg-white/95 dark:bg-[#0B0F1A]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-xl shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] z-(--z-dropdown) py-1`}
        >
          <button
            onClick={() => {
              onClose();
              onUploadClick();
            }}
            className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/10 px-4 py-3 w-full text-text-primary text-sm text-left transition-colors"
          >
            <LuUpload size={16} className="text-text-secondary" />
            Upload from system
          </button>
          <button
            onClick={() => {
              onClose();
              onCameraClick();
            }}
            className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/10 px-4 py-3 w-full text-text-primary text-sm text-left transition-colors"
          >
            <LuCamera size={16} className="text-text-secondary" />
            Take a picture
          </button>
          <div className="bg-black/10 dark:bg-white/10 my-1 w-full h-px" />
          <button
            onClick={onClose}
            className="group flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-3 w-full text-red-500 text-sm text-left transition-colors"
          >
            <LuTrash2 size={16} className="group-hover:text-red-500" />
            Remove photo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
