import Link from "next/link";
import Image from "next/image";
import { staticImagesConfig } from "@/config/common.config";
import { LogoProps } from "@/types/props/common.props.types";
import { defaultRoutes } from "@/lib/routes/routes";

const Logo = ({ type }: LogoProps) => {
  return (
    <Link href={defaultRoutes.landing} className="flex items-center gap-2">
      <Image
        src={staticImagesConfig.mainLogo.src}
        alt={staticImagesConfig.mainLogo.alt}
        width={100}
        height={100}
        className={`shadow-accent-purple-dark shadow-md rounded-full w-10 select-none ${type === "landing" ? "md:w-12 md:h-12" : ""}`}
      />
      <span className="text-shadow-accent-purple-dark text-shadow-lg font-lobster font-semibold text-text-primary text-xl md:text-3xl text-nowrap tracking-widest">
        App
      </span>
    </Link>
  );
};

export default Logo;
