import { useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { motion } from "motion/react";
import {
  LuGithub,
  LuLinkedin,
  LuEyeClosed,
  LuUser,
  LuMail,
} from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { LoginFormProps } from "@/types/props/auth.props.types";
import SocialButton from "@/components/auth/social.button";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormButton from "@/components/forms/shared/form.button";

const LoginForm = ({
  formVariants,
  loginField,
  passwordInput,
  isPending,
  formAction,
  handleProviderLogin,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      key="login-form"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 flex justify-center items-center px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-6 w-full overflow-y-auto no-scrollbar"
    >
      <div className="flex flex-col my-auto py-2 md:py-4 w-full max-w-md">
        <Form action={formAction} autoComplete="false">
          <h2 className="mb-4 text-center">Login</h2>

          <div className="relative flex flex-col gap-1 mb-2">
            <FormField
              label="Username / Email"
              htmlFor="loginField"
              required
              error={loginField.error}
            >
              <FormInput
                id="loginField"
                name="loginField"
                placeholder="you@example.com"
                autoComplete="off"
                value={loginField.raw}
                className="pr-9"
                onChange={(e) => loginField.handleInput(e.currentTarget.value)}
                onBlur={loginField.handleBlur}
                endIcon={<LuUser />}
                error={loginField.error}
              />
            </FormField>
          </div>

          <div className="relative flex flex-col gap-1 mb-2">
            <FormField
              label="Password"
              htmlFor="password"
              required
              error={passwordInput.error}
            >
              <FormInput
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="off"
                value={passwordInput.raw}
                className="pr-9"
                onChange={(e) =>
                  passwordInput.handleInput(e.currentTarget.value)
                }
                onBlur={passwordInput.handleBlur}
                endIcon={
                  showPassword ? (
                    <LuEyeClosed
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  ) : (
                    <FaRegEye
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  )
                }
                error={passwordInput.error}
              />
            </FormField>
          </div>

          <div className="flex justify-center mt-1 md:mt-2 mb-4 md:mb-6">
            <Link
              href="/forgot-password"
              className="font-medium text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <FormButton
            type="submit"
            variant="primary"
            loading={isPending}
            disabled={isPending}
            className="rounded-xl w-full"
          >
            Login
          </FormButton>
        </Form>

        <div className="mt-4 md:mt-8 text-text-secondary text-sm text-center">
          or login with social platforms
        </div>

        <div className="flex justify-center gap-2 md:gap-4 mt-3 md:mt-4">
          <SocialButton
            provider="Google"
            icon={FcGoogle}
            onClick={() => handleProviderLogin("google")}
            iconOnly
          />
          <SocialButton
            provider="GitHub"
            icon={LuGithub}
            onClick={() => handleProviderLogin("github")}
            iconOnly
          />
          {/* <SocialButton
            provider="Facebook"
            icon={LuFacebook}
            onClick={() => handleProviderLogin("facebook")}
            iconOnly
          /> */}
          <SocialButton
            provider="LinkedIn"
            icon={LuLinkedin}
            onClick={() => handleProviderLogin("linkedin")}
            iconOnly
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;
