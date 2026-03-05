import Image from "next/image";
import { IoIosWarning } from "react-icons/io";
import { errorsConfig, staticImages } from "@/config/config";

const NotFound = () => {
  return (
    <>
      <div className="flex justify-center items-center p-2 w-full h-dvh overflow-hidden font-inter text-2xl">
        <div className="flex flex-col justify-center items-center gap-2 bg-glass-warning p-2 border border-glass-warning-border rounded-xl w-full max-w-7xl h-[95%] text-glass-warning-text">
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={staticImages.notFoundError.src}
              alt={staticImages.notFoundError.alt}
              fill
              className="object-contain select-none"
            />
          </div>
          <h2 className="flex flex-col justify-center items-center gap-4 w-full text-center">
            <IoIosWarning className="text-glass-warning-text text-7xl" />
            <span>{errorsConfig.pageNotFoundError.message}</span>
          </h2>
        </div>
      </div>
    </>
  );
};

export default NotFound;
