import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { staticImages } from "@/config/common.config";
import { defaultRoutes } from "@/lib/routes/routes";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="relative flex justify-center items-start md:items-center px-4 md:px-4 py-20 h-dvh overflow-hidden">
      <div className="z-(--z-raised) relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href={defaultRoutes.discover}
            className="group inline-flex justify-center items-center gap-2 mb-6"
          >
            <Image
              src={staticImages.mainLogo.src}
              alt={staticImages.mainLogo.alt}
              width={100}
              height={100}
              className="shadow-glass-bg shadow-md rounded-full w-10 md:w-12 h-auto select-none"
            />
            <span className="font-tourney font-semibold text-3xl md:text-4xl tracking-tight">
              App Name
            </span>
          </Link>
          <h1 className="mb-2 text-3xl">{title}</h1>
          {subtitle && (
            <p className="text-text-secondary text-sm">{subtitle}</p>
          )}
        </div>

        <div className="shadow-2xl p-6 sm:p-8 border rounded-2xl glass-heavy">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
