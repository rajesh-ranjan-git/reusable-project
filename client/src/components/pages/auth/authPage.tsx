"use client";

import { ChangeEvent, SubmitEvent, useState } from "react";
import { motion, AnimatePresence, Variants, LayoutGroup } from "motion/react";
import {
  LuGithub,
  LuUser,
  LuLock,
  LuMail,
  LuFacebook,
  LuLinkedin,
} from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "@/components/auth/inputField";
import SocialButton from "@/components/auth/socialButton";
import Image from "next/image";
import { staticImages } from "@/config/common.config";

const GoogleIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function AuthPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoginState, setIsLoginState] = useState(pathname !== "/register");
  const isLogin = isLoginState; // Keeps the rest of your code working untouched!

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/chat");
    }, 1500);
  };

  const handleToggleMode = () => {
    const nextIsLogin = !isLoginState;
    setIsLoginState(nextIsLogin);

    // Update URL natively without forcing Next.js to unmount the page!
    window.history.pushState(null, "", nextIsLogin ? "/login" : "/register");
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, x: isLogin ? 50 : -50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4 } },
  };

  return (
    <LayoutGroup>
      <div className="fixed inset-0 flex justify-center items-center bg-bg selection:bg-primary/30 p-4 sm:p-6 w-full h-dvh">
        <div className="hidden sm:block top-1/4 -left-64 absolute bg-primary/20 blur-[100px] rounded-full w-125 h-125 pointer-events-none mix-blend-screen"></div>
        <div className="hidden sm:block -right-64 bottom-1/4 absolute bg-accent/20 blur-[120px] rounded-full w-150 h-150 pointer-events-none mix-blend-screen"></div>

        <div
          className={`relative z-10 w-full max-w-4xl bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-212.5 transition-all duration-1000 isolate ${!isLogin ? "md:flex-row-reverse" : ""}`}
        >
          <motion.div
            layout
            initial={false}
            className={`w-full md:w-1/2 bg-primary flex flex-col items-center justify-center p-6 md:p-12 text-center text-white min-h-55 md:min-h-0 md:h-full shadow-lg shadow-primary/20 relative z-20 shrink-0 transition-[border-radius] duration-800 ease-in-out ${isLogin ? "md:rounded-r-[150px] rounded-b-[40px] md:rounded-bl-none md:rounded-tl-none" : "md:rounded-l-[150px] rounded-b-[40px] md:rounded-br-none md:rounded-tr-none"}`}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 space-y-2 md:space-y-6 w-full max-w-xs md:max-w-xs"
            >
              <Link
                href="/"
                className="group flex flex-row md:flex-col justify-center items-center gap-3 md:gap-4 mb-0 md:mb-2"
              >
                <div className="flex justify-center items-center shadow-black/10 shadow-lg rounded-full w-12 md:w-20 h-12 md:h-20 group-hover:scale-105 transition-transform shrink-0">
                  <Image
                    src={staticImages.mainLogo.src}
                    alt={staticImages.mainLogo.alt}
                    width={200}
                    height={200}
                    className="shadow-md rounded-full select-none"
                  />
                </div>
                <div className="flex flex-col items-start md:items-center gap-0 md:gap-1 mt-0 md:mt-2">
                  <span className="font-bold text-white text-2xl md:text-4xl leading-none tracking-tight">
                    Your App Name
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
                  <p className="font-medium text-white/80 text-sm md:text-xl tracking-wide">
                    Welcome!
                  </p>
                  <p className="font-medium text-white/90 text-sm md:text-base">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </p>
                  <div className="w-full md:w-auto">
                    <button
                      onClick={handleToggleMode}
                      className="inline-block hover:bg-white/10 px-6 md:px-8 py-2 md:py-2.5 border-2 border-white rounded-full md:w-auto font-medium text-white text-sm md:text-base transition-colors"
                    >
                      {isLogin ? "Register" : "Login"}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <motion.div
            layout
            transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
            className="z-10 relative flex flex-col bg-surface w-full md:w-1/2 h-full shrink-0"
          >
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute flex justify-center items-center p-4 sm:p-6 md:p-8 w-full h-max overflow-y-auto custom-scrollbar"
                >
                  <div className="flex flex-col my-auto py-2 md:py-4 w-full max-w-md">
                    <div className="mb-4 md:mb-8 text-center">
                      <h2 className="font-bold text-white text-2xl md:text-3xl">
                        Login
                      </h2>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-1 md:gap-2"
                    >
                      <InputField
                        label=""
                        type="text"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("email", e.target.value)
                        }
                        icon={LuUser}
                        required
                      />

                      <InputField
                        label=""
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("password", e.target.value)
                        }
                        icon={LuLock}
                        required
                      />

                      <div className="flex justify-center mt-1 md:mt-2 mb-4 md:mb-6">
                        <Link
                          href="/forgot-password"
                          className="font-medium text-text-secondary hover:text-white text-sm transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-70 shadow-lg shadow-primary/20 py-3 md:py-3.5 rounded-lg w-full font-bold text-white text-base transition-all disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <TbLoader3 size={20} className="animate-spin" />
                        ) : (
                          "Login"
                        )}
                      </button>
                    </form>

                    <div className="mt-4 md:mt-8 text-text-secondary text-sm text-center">
                      or login with social platforms
                    </div>

                    <div className="flex justify-center gap-2 md:gap-4 mt-3 md:mt-4">
                      <SocialButton
                        provider="Google"
                        icon={GoogleIcon}
                        onClick={() => {}}
                        iconOnly
                      />
                      <SocialButton
                        provider="Facebook"
                        icon={LuFacebook}
                        onClick={() => {}}
                        iconOnly
                      />
                      <SocialButton
                        provider="GitHub"
                        icon={LuGithub}
                        onClick={() => {}}
                        iconOnly
                      />
                      <SocialButton
                        provider="LinkedIn"
                        icon={LuLinkedin}
                        onClick={() => {}}
                        iconOnly
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute flex justify-center items-center p-4 sm:p-6 md:p-8 w-full h-max overflow-y-auto custom-scrollbar"
                >
                  <div className="flex flex-col my-auto py-4 w-full max-w-md">
                    <div className="mb-4 md:mb-6 text-center">
                      <h2 className="font-bold text-white text-2xl md:text-3xl">
                        Register
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col">
                      <InputField
                        label=""
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("name", e.target.value)
                        }
                        icon={LuUser}
                        required
                      />

                      <InputField
                        label=""
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("email", e.target.value)
                        }
                        icon={LuMail}
                        required
                      />

                      <InputField
                        label=""
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("password", e.target.value)
                        }
                        icon={LuLock}
                        required
                      />

                      <div className="mt-1 mb-4 text-text-secondary text-xs text-center leading-relaxed">
                        By signing up, you agree to our{" "}
                        <a
                          href="#"
                          className="text-white hover:text-primary underline"
                        >
                          Terms
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-white hover:text-primary underline"
                        >
                          Privacy Policy
                        </a>
                        .
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-70 shadow-lg shadow-primary/20 py-3 md:py-3.5 rounded-lg w-full font-bold text-white text-base transition-all disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <TbLoader3 size={20} className="animate-spin" />
                        ) : (
                          "Register"
                        )}
                      </button>
                    </form>

                    <div className="mt-4 md:mt-5 text-text-secondary text-sm text-center">
                      or register with social platforms
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                      <SocialButton
                        provider="Google"
                        icon={GoogleIcon}
                        onClick={() => {}}
                        iconOnly
                      />
                      <SocialButton
                        provider="Facebook"
                        icon={LuFacebook}
                        onClick={() => {}}
                        iconOnly
                      />
                      <SocialButton
                        provider="GitHub"
                        icon={LuGithub}
                        onClick={() => {}}
                        iconOnly
                      />
                      <SocialButton
                        provider="LinkedIn"
                        icon={LuLinkedin}
                        onClick={() => {}}
                        iconOnly
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </LayoutGroup>
  );
}
