"use client";

import { useActionState, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { ProviderLoginDataType } from "@/types/types/auth.types";
import { useAppStore } from "@/store/store";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  validateLoginIdentifier,
} from "@/validators/auth.validators";
import { authRoutes, defaultRoutes } from "@/lib/routes/routes";
import { loginAction, registerAction } from "@/lib/actions/auth.actions";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { useOAuthListener } from "@/hooks/useOAuthListener";
import { loginWithProvider, providerLogin } from "@/lib/actions/oauth.actions";
import AuthBanner from "@/components/auth/auth.banner";
import LoginForm from "@/components/forms/auth/login.form";
import { getFormVariants } from "@/utils/auth.utils";
import RegisterForm from "@/components/forms/auth/register.form";
import { initialState } from "@/config/forms.config";
import { FormStateType } from "@/types/types/actions.types";

const AuthPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoginState, setIsLoginState] = useState(
    pathname !== authRoutes.register,
  );
  const isLogin = isLoginState;

  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const setLoggedInUser = useAppStore((state) => state.setLoggedInUser);

  const { showToast } = useToast();

  useOAuthListener();

  const emailInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { isEmailValid, message } = emailValidator(val);

      if (!isEmailValid)
        return message ?? "Please provide a valid email address!";

      return "";
    },
  });

  const passwordInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { isPasswordValid, message } = passwordValidator(val);

      if (!isPasswordValid) return message ?? "Please provide your password!";

      return "";
    },
  });

  const firstNameInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { isNameValid, message } = nameValidator(val, "firstName");
      if (!isNameValid) return message ?? "Please provide your password!";

      return "";
    },
  });

  const lastNameInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { isNameValid, message } = nameValidator(val, "lastName");

      if (!isNameValid) return message ?? "Please provide your password!";

      return "";
    },
  });

  const loginField = useInputFieldValidator<string>({
    initialValue: "",
    validate: validateLoginIdentifier,
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => {
    if (pathname === authRoutes.register) {
      return registerAction(prevState, formData);
    } else if (pathname.includes(authRoutes.login)) {
      return loginAction(prevState, formData);
    }

    return prevState;
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  const handleToggleMode = () => {
    const nextIsLogin = !isLoginState;
    setIsLoginState(nextIsLogin);

    window.history.pushState(
      null,
      "",
      nextIsLogin ? `${authRoutes.login}` : `${authRoutes.register}`,
    );
  };

  const handleProviderLogin = async (provider: string) => {
    const token = await loginWithProvider(provider);

    if (token) {
      const providerLoginResponse = await providerLogin(
        provider,
        token as string,
      );

      if (!providerLoginResponse?.success) {
        showToast({
          title: providerLoginResponse.code,
          message: providerLoginResponse.message,
          variant: "error",
        });
      } else {
        const providerLoginData =
          providerLoginResponse.data as ProviderLoginDataType;

        setAccessToken(providerLoginData.accessToken);
        setLoggedInUser(providerLoginData.user);

        router.push(defaultRoutes.landing);
      }
    }
  };

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (!state?.success) {
      showToast({
        title: state.code,
        message: state.message,
        variant: "error",
      });
    } else {
      setAccessToken(state.data.accessToken);
      setLoggedInUser(state.data.user);

      showToast({
        title: state.status,
        message: state.message!,
        variant: "success",
      });

      if (pathname === authRoutes.register) {
        handleToggleMode();
      } else {
        router.push(defaultRoutes.landing);
      }
    }
  }, [state]);

  useEffect(() => {
    emailInput.reset();
    passwordInput.reset();
    firstNameInput.reset();
    lastNameInput.reset();
  }, [pathname, state]);

  return (
    <LayoutGroup>
      <div className="fixed inset-0 flex justify-center items-center selection:bg-primary/30 p-4 sm:p-6 w-full h-dvh">
        <div
          className={`relative z-(--z-raised) w-full max-w-7xl glass overflow-hidden flex flex-col md:flex-row h-full max-h-212.5 min-h-0 transition-all duration-1000 isolate ${!isLogin ? "md:flex-row-reverse" : ""}`}
        >
          <AuthBanner isLogin={isLogin} handleToggleMode={handleToggleMode} />

          <motion.div
            layout
            transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
            className="z-(--z-raised) relative flex flex-col md:flex-none w-full md:w-1/2 min-h-[65%] shrink-0"
          >
            <AnimatePresence mode="wait">
              {isLogin ? (
                <LoginForm
                  formVariants={getFormVariants(isLogin)}
                  loginField={loginField}
                  passwordInput={passwordInput}
                  isPending={isPending}
                  formAction={formAction}
                  handleProviderLogin={handleProviderLogin}
                />
              ) : (
                <RegisterForm
                  formVariants={getFormVariants(isLogin)}
                  emailInput={emailInput}
                  firstNameInput={firstNameInput}
                  lastNameInput={lastNameInput}
                  passwordInput={passwordInput}
                  isPending={isPending}
                  formAction={formAction}
                  handleProviderLogin={handleProviderLogin}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </LayoutGroup>
  );
};

export default AuthPage;
