import Image from "next/image";
import { staticImages } from "@/config/config";

const DefaultMainContent = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 pb-10 w-full h-dvh font-poppins font-bold select-none container">
      <div className="z-16 w-24 h-24 object-cover">
        <Image
          src={staticImages.mainLogo.src}
          alt={staticImages.mainLogo.alt}
          width={200}
          height={200}
          className="shadow-md rounded-full select-none"
        />
      </div>
      <span className="text-3xl">Your App Name</span>
    </div>
  );
};

export default DefaultMainContent;
