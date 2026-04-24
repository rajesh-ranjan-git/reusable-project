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
import { RegisterFormProps } from "@/types/props/auth.props.types";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormButton from "@/components/forms/shared/form.button";
import SocialButton from "@/components/auth/social.button";

const RegisterForm = ({
  formVariants,
  emailInput,
  firstNameInput,
  lastNameInput,
  passwordInput,
  isPending,
  formAction,
  handleProviderLogin,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      key="register-form"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 flex justify-center items-center px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-6 w-full overflow-y-auto no-scrollbar"
    >
      <div className="flex flex-col my-auto py-2 w-full max-w-md">
        <Form action={formAction} autoComplete="false">
          <h2 className="mb-2 text-center">Register</h2>

          <div className="relative flex flex-col gap-1 mb-2">
            <FormField
              label="Email"
              htmlFor="email"
              required
              error={emailInput.error}
            >
              <FormInput
                type="text"
                name="email"
                placeholder="you@example.com"
                autoComplete="off"
                value={emailInput.raw}
                className="pr-9"
                onChange={(e) => emailInput.handleInput(e.currentTarget.value)}
                onBlur={emailInput.handleBlur}
                endIcon={<LuMail />}
                error={emailInput.error}
              />
            </FormField>
          </div>

          <div className="flex gap-1 md:gap-2">
            <div className="flex flex-col w-full">
              <div className="relative flex flex-col gap-1 mb-2">
                <FormField
                  label="First Name"
                  htmlFor="firstName"
                  error={firstNameInput.error}
                >
                  <FormInput
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    autoComplete="off"
                    value={firstNameInput.raw}
                    className="pr-9"
                    onChange={(e) =>
                      firstNameInput.handleInput(e.currentTarget.value)
                    }
                    onBlur={firstNameInput.handleBlur}
                    endIcon={<LuUser />}
                    error={firstNameInput.error}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <div className="relative flex flex-col gap-1 mb-2">
                <FormField
                  label="Last Name"
                  htmlFor="lastName"
                  error={lastNameInput.error}
                >
                  <FormInput
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    autoComplete="off"
                    value={lastNameInput.raw}
                    className="pr-9"
                    onChange={(e) =>
                      lastNameInput.handleInput(e.currentTarget.value)
                    }
                    onBlur={lastNameInput.handleBlur}
                    endIcon={<LuUser />}
                    error={lastNameInput.error}
                  />
                </FormField>
              </div>
            </div>
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

          <FormButton
            type="submit"
            variant="primary"
            loading={isPending}
            disabled={isPending}
            className="rounded-xl w-full"
          >
            Register
          </FormButton>
        </Form>

        <div className="mt-4 md:mt-5 text-text-secondary text-sm text-center">
          or register with social platforms
        </div>

        <div className="flex justify-center gap-4 mt-4">
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

export default RegisterForm;
