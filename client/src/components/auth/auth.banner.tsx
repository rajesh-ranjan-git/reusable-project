import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { staticImagesConfig } from "@/config/common.config";
import { AuthBannerProps } from "@/types/props/auth.props.types";
import { defaultRoutes } from "@/lib/routes/routes";
import DecorativeRings from "@/components/background/decorative.rings";

const AuthBanner = ({ isLogin, handleToggleMode }: AuthBannerProps) => {
  return (
    <motion.div
      layout
      initial={false}
      className={`w-full md:w-1/2 bg-(image:--gradient-brand-vivid) flex flex-col items-center justify-center p-4 md:p-12 text-center text-primary min-h-55 md:min-h-0 md:h-full shadow-lg relative z-20 shrink-0 transition-[border-radius] duration-800 ease-in-out overflow-hidden ${isLogin ? "md:rounded-r-[150px] rounded-b-[40px] md:rounded-bl-none md:rounded-tl-none" : "md:rounded-l-[150px] rounded-b-[40px] md:rounded-br-none md:rounded-tr-none"}`}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
    >
      <DecorativeRings />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 space-y-2 md:space-y-6 w-full max-w-xs md:max-w-xs"
      >
        <Link
          href={defaultRoutes.landing}
          className="group flex flex-row md:flex-col justify-center items-center gap-3 md:gap-4 mb-0 md:mb-2"
        >
          <div className="flex justify-center items-center shadow-glass-bg shadow-lg rounded-full w-12 md:w-20 h-12 md:h-20 group-hover:scale-105 transition-transform shrink-0">
            <Image
              src={staticImagesConfig.mainLogo.src}
              alt={staticImagesConfig.mainLogo.alt}
              width={200}
              height={200}
              className="shadow-md rounded-full select-none"
            />
          </div>
          <div className="flex flex-col items-start md:items-center gap-0 md:gap-1 mt-0 md:mt-2">
            <span className="font-tourney font-bold text-text-on-accent text-2xl md:text-4xl leading-none tracking-wide">
              App Name
            </span>
          </div>
        </Link>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login-text" : "register-text"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-2 w-full"
          >
            <p className="font-medium text-text-on-accent text-sm md:text-xl tracking-wide">
              Welcome!
            </p>
            <p className="font-medium text-text-on-accent/80 text-sm md:text-base">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <div className="w-full md:w-auto">
              <button
                onClick={handleToggleMode}
                className="inline-block px-6 md:px-8 py-2 md:py-2.5 border-2 border-accent-purple-light hover:border-accent-purple-light md:w-auto font-medium text-sm md:text-base transition-colors ease-in-out btn btn-primary"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AuthBanner;
