import { useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "motion/react";
import { LuCamera, LuCameraOff, LuRefreshCw, LuX } from "react-icons/lu";
import Image from "next/image";

type CameraModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imgSrc: string) => void;
};

export default function CameraModal({
  isOpen,
  onClose,
  onCapture,
}: CameraModalProps) {
  const webcamRef = useRef<Webcam | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [webcamError, setWebcamError] = useState(false);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const handleRetake = () => {
    setImgSrc(null);
    setWebcamError(false);
  };

  const handleConfirm = () => {
    if (imgSrc) onCapture(imgSrc);
    setImgSrc(null);
    setWebcamError(false);
    onClose();
  };

  const handleReset = () => {
    setImgSrc(null);
    setWebcamError(false);
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          key="camera-modal-wrapper"
          className="z-(--z-modal) fixed inset-0 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-glass-bg backdrop-blur-sm duration-300"
            onClick={() => handleReset()}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative flex flex-col w-full max-w-lg overflow-hidden glass"
          >
            <div className="flex items-center p-2">
              <h3 className="pt-1 w-full font-arima font-semibold text-center">
                Take a picture
              </h3>
              <button onClick={onClose} className="p-1.5 glass-interactive">
                <LuX size={20} />
              </button>
            </div>

            <div className="flex flex-col justify-center items-center p-2 min-h-75 md:min-h-full">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt="captured"
                  width={400}
                  height={400}
                  className="shadow-inner rounded-lg w-full object-cover"
                />
              ) : (
                <div className="relative flex justify-center items-center rounded-md w-full min-h-75 overflow-hidden">
                  {!webcamError ? (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "user" }}
                      className="w-full min-h-75 object-cover"
                      onUserMediaError={() => setWebcamError(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center p-6 text-center">
                      <LuCameraOff className="mb-3 w-12 h-12 text-status-error-text" />
                      <p className="text-status-error-text">
                        Camera access denied or unavailable!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-4 p-4 border-glass-border border-t">
              {imgSrc ? (
                <>
                  <button
                    onClick={handleRetake}
                    className="px-6 md:px-10 btn btn-secondary"
                  >
                    <LuRefreshCw size={18} /> Retake
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-6 md:px-10 btn btn-primary"
                  >
                    Use Photo
                  </button>
                </>
              ) : (
                <button
                  onClick={capture}
                  disabled={webcamError}
                  className="group flex justify-center items-center disabled:opacity-50 rounded-full w-16 h-16 transition-all disabled:cursor-not-allowed glass-heavy"
                  title="Capture"
                >
                  <div className="flex justify-center items-center rounded-full w-full h-full group-hover:scale-110 transition-transform">
                    <LuCamera
                      className="text-text-secondary group-hover:text-text-primary"
                      size={24}
                    />
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
