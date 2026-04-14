"use client";

import { ChangeEvent, SubmitEvent, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants, LayoutGroup } from "motion/react";
import {
  LuGithub,
  LuFacebook,
  LuLinkedin,
  LuEyeClosed,
  LuUser,
  LuMail,
} from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { staticImages } from "@/config/common.config";
import SocialButton from "@/components/auth/socialButton";
import { authRoutes, chatRoutes, defaultRoutes } from "@/lib/routes/routes";

const DecorativeRings = () => (
  <div className="z-(--z-background) absolute inset-0 flex justify-center items-center overflow-hidden pointer-events-none">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute opacity-20 border border-glass-bg rounded-full"
        style={{
          width: `${i * 140 + 80}px`,
          height: `${i * 140 + 80}px`,
        }}
        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
        transition={{
          duration: 20 + i * 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
    <div className="absolute opacity-50 blur-2xl rounded-full w-32 h-32 glass" />
  </div>
);

const AuthPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoginState, setIsLoginState] = useState(
    pathname !== authRoutes.register,
  );
  const isLogin = isLoginState;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
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
      router.push(chatRoutes.chat);
    }, 1500);
  };

  const handleToggleMode = () => {
    const nextIsLogin = !isLoginState;
    setIsLoginState(nextIsLogin);

    window.history.pushState(
      null,
      "",
      nextIsLogin ? `${authRoutes.login}` : `${authRoutes.register}`,
    );
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
      <div className="fixed inset-0 flex justify-center items-center selection:bg-primary/30 p-4 sm:p-6 w-full h-dvh">
        <div
          className={`relative z-(--z-raised) w-full max-w-7xl glass overflow-hidden flex flex-col md:flex-row h-full max-h-212.5 min-h-0 transition-all duration-1000 isolate ${!isLogin ? "md:flex-row-reverse" : ""}`}
        >
          <motion.div
            layout
            initial={false}
            className={`w-full md:w-1/2 bg-(image:--gradient-brand-vivid) flex flex-col items-center justify-center p-4 md:p-12 text-center text-primary min-h-55 md:min-h-0 md:h-full shadow-lg relative z-20 shrink-0 transition-[border-radius] duration-800 ease-in-out ${isLogin ? "md:rounded-r-[150px] rounded-b-[40px] md:rounded-bl-none md:rounded-tl-none" : "md:rounded-l-[150px] rounded-b-[40px] md:rounded-br-none md:rounded-tr-none"}`}
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
                    src={staticImages.mainLogo.src}
                    alt={staticImages.mainLogo.alt}
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
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}
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

          <motion.div
            layout
            transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
            className="z-(--z-raised) relative flex flex-col md:flex-none w-full md:w-1/2 min-h-[65%] shrink-0"
          >
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 flex justify-center items-center px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-6 w-full overflow-y-auto custom-scrollbar"
                >
                  <div className="flex flex-col my-auto py-2 md:py-4 w-full max-w-md">
                    <form onSubmit={handleSubmit}>
                      <h2 className="mb-4 text-center">Login</h2>

                      <div className="relative flex flex-col gap-1 mb-2">
                        <label className="ml-2">Username / Email</label>
                        <input
                          type="text"
                          placeholder="you@example.com"
                          value={formData.email}
                          className="pr-9"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange("email", e.target.value)
                          }
                        />
                        <LuUser className="right-3 bottom-2 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />
                      </div>

                      <div className="relative flex flex-col gap-1 mb-2">
                        <label className="ml-2">Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          className="pr-9"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange("password", e.target.value)
                          }
                        />
                        {showPassword ? (
                          <LuEyeClosed
                            className="right-3 bottom-2 absolute w-4 h-4 text-text-secondary -translate-y-1/2"
                            onClick={() => setShowPassword((prev) => !prev)}
                          />
                        ) : (
                          <FaRegEye
                            className="right-3 bottom-2 absolute w-4 h-4 text-text-secondary -translate-y-1/2"
                            onClick={() => setShowPassword((prev) => !prev)}
                          />
                        )}
                      </div>

                      <div className="flex justify-center mt-1 md:mt-2 mb-4 md:mb-6">
                        <Link
                          href="/forgot-password"
                          className="font-medium text-text-secondary hover:text-text-primary text-sm transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-text-on-accent transition-all disabled:cursor-not-allowed btn btn-primary"
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
                        icon={FcGoogle}
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
                  className="absolute inset-0 flex justify-center items-center px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-6 w-full overflow-y-auto custom-scrollbar"
                >
                  <div className="flex flex-col my-auto py-2 w-full max-w-md">
                    <form onSubmit={handleSubmit}>
                      <h2 className="mb-2 text-center">Register</h2>

                      <div className="relative flex flex-col gap-1 mb-2">
                        <label className="ml-2">Email</label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          className="pr-9"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange("email", e.target.value)
                          }
                        />
                        <LuMail className="right-3 bottom-2 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />
                      </div>

                      <div className="flex gap-1 md:gap-2">
                        <div className="relative flex flex-col gap-1 mb-2">
                          <label className="ml-2">First Name</label>
                          <input
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            className="pr-9"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleChange("firstName", e.target.value)
                            }
                          />
                          <LuUser className="right-3 bottom-2 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />
                        </div>
                        <div className="relative flex flex-col gap-1 mb-2">
                          <label className="ml-2">Last Name</label>
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            className="pr-9"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleChange("lastName", e.target.value)
                            }
                          />
                          <LuUser className="right-3 bottom-2 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="relative flex flex-col gap-1 mb-2">
                        <label className="ml-2">Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          className="pr-9"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange("password", e.target.value)
                          }
                        />
                        {showPassword ? (
                          <LuEyeClosed
                            className="right-3 bottom-2 absolute w-4 h-4 text-text-secondary -translate-y-1/2"
                            onClick={() => setShowPassword((prev) => !prev)}
                          />
                        ) : (
                          <FaRegEye
                            className="right-3 bottom-2 absolute w-4 h-4 text-text-secondary -translate-y-1/2"
                            onClick={() => setShowPassword((prev) => !prev)}
                          />
                        )}
                      </div>

                      <div className="mt-1 mb-4 text-text-secondary text-xs text-center leading-relaxed">
                        By signing up, you agree to our&nbsp;
                        <Link
                          href="#"
                          className="text-text-link hover:text-text-link-hover underline"
                        >
                          Terms
                        </Link>
                        &nbsp;and&nbsp;
                        <Link
                          href="#"
                          className="text-text-link hover:text-text-link-hover underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-text-on-accent transition-all disabled:cursor-not-allowed btn btn-primary"
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
                        icon={FcGoogle}
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
};

export default AuthPage;
