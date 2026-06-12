import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { LuX } from "react-icons/lu";
import { ImagePreviewProps } from "@/types/props/profile.props.types";
import { getFullName } from "@/helpers/profile.helpers";

const ImagePreview = ({
  user,
  previewImage,
  setPreviewImage,
}: ImagePreviewProps) => {
  return (
    <>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {previewImage && (
              <div className="z-(--z-modal) fixed inset-0 flex justify-center items-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 backdrop-blur-md"
                  onClick={() => setPreviewImage(null)}
                />

                <motion.img
                  key={previewImage}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{
                    scale: 0.9,
                    opacity: 0,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  src={previewImage}
                  alt={getFullName(user)}
                  className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl max-w-full max-h-[90vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  className="top-6 right-6 absolute p-2 rounded-full glass"
                  onClick={() => setPreviewImage(null)}
                >
                  <LuX size={24} />
                </button>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default ImagePreview;
