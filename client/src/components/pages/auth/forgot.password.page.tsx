"use client";

import { SubmitEvent, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import { LuArrowLeft, LuMail } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import { emailValidator } from "@/validators/auth.validators";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { authRoutes } from "@/lib/routes/routes";
import AuthLayout from "@/components/auth/auth.layout";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import { initialState } from "@/config/forms.config";
import { FormStateType } from "@/types/types/actions.types";
import { forgotPasswordAction } from "@/lib/actions/auth.actions";
import { useToast } from "@/hooks/toast";
import FormButton from "@/components/forms/shared/form.button";
import Form from "next/form";

const ForgotPasswordPage = () => {
  const { showToast } = useToast();

  const emailInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { isEmailValid, message } = emailValidator(val);

      if (!isEmailValid)
        return message ?? "Please provide a valid email address!";

      return "";
    },
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => forgotPasswordAction(prevState, formData);

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
      title="Reset your password"
      subtitle="We'll send you instructions to reset your password"
    >
      {state?.success ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="flex justify-center items-center bg-status-success-bg mb-6 border border-status-success-border rounded-full w-16 h-16 text-status-success-text">
            <FiCheckCircle size={32} />
          </div>
          <h3 className="mb-2">Check your email</h3>
          <p className="mb-4 text-text-secondary leading-relaxed">
            <span>We've sent a password reset link to&nbsp;</span>
            <span className="font-medium text-white">{emailInput.raw}</span>.
            Click the link to set a new password.
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
        <div className="flex flex-col items-center gap-8">
          <Form action={formAction} autoComplete="off" className="w-full">
            <div className="flex flex-col gap-1 mb-4">
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
                  onChange={(e) =>
                    emailInput.handleInput(e.currentTarget.value)
                  }
                  onBlur={emailInput.handleBlur}
                  endIcon={<LuMail />}
                  error={emailInput.error}
                />
              </FormField>
            </div>

            <FormButton
              type="submit"
              variant="primary"
              loading={isPending}
              disabled={
                isPending ||
                (emailInput.raw.trim().length === 0 && !!emailInput.error)
              }
              className="rounded-xl w-full"
            >
              Send Reset Link
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

export default ForgotPasswordPage;
