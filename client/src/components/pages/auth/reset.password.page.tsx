"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import { LuArrowLeft, LuEyeClosed, LuShieldQuestion } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { TbLoader3 } from "react-icons/tb";
import { initialState } from "@/config/forms.config";
import { FormStateType } from "@/types/types/actions.types";
import { passwordValidator } from "@/validators/auth.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { resetPasswordAction } from "@/lib/actions/auth.actions";
import { authRoutes } from "@/lib/routes/routes";
import AuthLayout from "@/components/auth/auth.layout";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormButton from "@/components/forms/shared/form.button";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { showToast } = useToast();

  const passwordInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { isPasswordValid, message } = passwordValidator(val);

      if (!isPasswordValid)
        return message ?? "Please provide a valid password!";

      return "";
    },
  });

  const confirmPasswordInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      if (passwordInput.raw !== val) {
        return "Password and confirm password must match!";
      }

      const { isPasswordValid, message } = passwordValidator(val);

      if (!isPasswordValid)
        return message ?? "Please provide a valid password!";

      return "";
    },
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => resetPasswordAction(prevState, formData);

  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (!state?.success) {
      showToast({
        title: state.code,
        message: state.message,
        variant: "error",
      });
    } else {
      showToast({
        title: state.status,
        message: state.message!,
        variant: "success",
      });
    }
  }, [state]);

  return (
    <AuthLayout
      title="Password Reset"
      subtitle={`${!token ? "" : state?.success ? "Password reset successful!" : "Enter your new password to reset"}`}
    >
      {isPending ? (
        <p className="flex items-center gap-2">
          <span>
            <TbLoader3 size={28} className="animate-spin" />
          </span>
          <span>Resetting your password...</span>
        </p>
      ) : state?.success ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="flex justify-center items-center bg-status-success-bg mb-6 border border-status-success-border rounded-full w-16 h-16 text-status-success-text">
            <FiCheckCircle size={32} />
          </div>
          <h3 className="mb-2">Password Reset</h3>
          <p className="mb-4 text-text-secondary leading-relaxed">
            Your password has been reset successfully, please login to continue.
          </p>

          <Link
            href={authRoutes.login}
            className="group flex justify-center items-center gap-2 rounded-full transition-all ease-in-out btn btn-ghost"
          >
            <LuArrowLeft
              size={16}
              className="group-hover:scale-x-120 transition-all group-hover:-translate-x-1.5 ease-in-out"
            />
            Back to log in
          </Link>
        </div>
      ) : !token ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="flex justify-center items-center bg-status-error-bg mb-6 border border-status-error-border rounded-full w-16 h-16 text-status-error-text">
            <LuShieldQuestion size={32} />
          </div>
          <h3 className="mb-2 text-status-error-text">Reset Password Failed</h3>
          <p className="mb-4 text-status-error-text leading-relaxed">
            We were not able to verify the password reset token, please try
            again!
          </p>

          <Link
            href={authRoutes.login}
            className="group flex justify-center items-center gap-2 rounded-full transition-all ease-in-out btn btn-ghost"
          >
            <LuArrowLeft
              size={16}
              className="group-hover:scale-x-120 transition-all group-hover:-translate-x-1.5 ease-in-out"
            />
            Back to log in
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Form action={formAction} autoComplete="off" className="w-full">
            <div className="flex flex-col gap-1 mb-4">
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

              <FormField
                label="Confirm Password"
                htmlFor="confirmPassword"
                required
                error={confirmPasswordInput.error}
              >
                <FormInput
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Password"
                  autoComplete="off"
                  value={confirmPasswordInput.raw}
                  className="pr-9"
                  onChange={(e) =>
                    confirmPasswordInput.handleInput(e.currentTarget.value)
                  }
                  onBlur={confirmPasswordInput.handleBlur}
                  endIcon={
                    showConfirmPassword ? (
                      <LuEyeClosed
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      />
                    ) : (
                      <FaRegEye
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      />
                    )
                  }
                  error={confirmPasswordInput.error}
                />
              </FormField>

              <input type="hidden" name="token" value={token ?? ""} />
            </div>

            <FormButton
              type="submit"
              variant="primary"
              loading={isPending}
              disabled={
                isPending ||
                (passwordInput.raw.trim().length === 0 && !!passwordInput.error)
              }
              className="rounded-xl w-full"
            >
              Reset Password
            </FormButton>
          </Form>

          <Link
            href={authRoutes.login}
            className="group flex justify-center items-center gap-2 px-8 rounded-full w-max transition-all ease-in-out btn btn-ghost"
          >
            <LuArrowLeft
              size={16}
              className="group-hover:scale-x-120 transition-all group-hover:-translate-x-1.5 ease-in-out"
            />
            Back to log in
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
