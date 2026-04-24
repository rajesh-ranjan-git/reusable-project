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

const ImageUploadMenu = ({
  isOpen,
  onClose,
  onUploadClick,
  onCameraClick,
  positionClass = "top-full right-0 mt-2",
}: ImageUploadMenuProps) => {
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
          className={`absolute ${positionClass} w-64 glass-heavy backdrop-blur-md z-(--z-dropdown) pt-1 flex flex-col overflow-hidden`}
        >
          <ul className="max-h-75">
            <li
              onClick={() => {
                onClose();
                onUploadClick();
              }}
              className="flex items-center gap-3 hover:bg-glass-bg-hover px-4 py-2 w-full text-left"
            >
              <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                <LuUpload size={16} />
              </div>
              <div className="flex-1">
                <p className="text-text-primary text-sm leading-snug">
                  Upload from system
                </p>
              </div>
            </li>
            <li
              onClick={() => {
                onClose();
                onCameraClick();
              }}
              className="flex items-center gap-3 hover:bg-glass-bg-hover px-4 py-2 w-full text-left"
            >
              <div className="mt-0.5 p-1.5 border border-accent-purple-dark/30 rounded-full">
                <LuCamera size={16} />
              </div>
              <div className="flex-1">
                <p className="text-text-primary text-sm leading-snug">
                  Take a picture
                </p>
              </div>
            </li>
          </ul>

          <div
            onClick={onClose}
            className="flex justify-center items-center gap-2 hover:bg-status-error-bg mt-1 px-4 py-1 border-accent-purple-dark/30 border-t w-full text-status-error-text text-left cursor-pointer"
          >
            <button className="w-full h-full text-xs leading-snug">
              <LuTrash2 size={16} />
              Remove photo
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageUploadMenu;
