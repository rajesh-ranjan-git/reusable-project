"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { FiCheckCircle } from "react-icons/fi";
import { LuArrowLeft, LuShieldQuestion } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import {
  ApiErrorResponseType,
  ApiSuccessResponseType,
} from "@/types/types/api.types";
import { VerifyEmailResponseType } from "@/types/types/response.types";
import { defaultRoutes } from "@/lib/routes/routes";
import { verifyEmail } from "@/lib/actions/auth.actions";
import AuthLayout from "@/components/auth/auth.layout";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyEmailMutation = useMutation<
    ApiSuccessResponseType<VerifyEmailResponseType>,
    ApiErrorResponseType,
    { token: string }
  >({
    mutationFn: ({ token }) => verifyEmail(token),
  });

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate({ token });
    }
  }, [token]);

  const renderVerifyEmailContent = () => {
    if (verifyEmailMutation.isPending) {
      return (
        <p className="flex items-center gap-2">
          <span>
            <TbLoader3 size={28} className="animate-spin" />
          </span>
          <span>Verifying email...</span>
        </p>
      );
    }

    if (verifyEmailMutation.data) {
      return (
        <>
          <div className="flex justify-center items-center bg-status-success-bg mb-6 border border-status-success-border rounded-full w-16 h-16 text-status-success-text">
            <FiCheckCircle size={32} />
          </div>
          <h3 className="mb-2">Email Verification Success</h3>
          <p className="mb-4 text-text-secondary leading-relaxed">
            <span>
              Your email&nbsp;
              <span className="font-medium text-white">
                {verifyEmailMutation.data.data?.email}
              </span>
              &nbsp;has been verified successfully!
            </span>
          </p>

          <Link
            href={defaultRoutes.landing}
            className="group flex justify-center items-center gap-2 rounded-full transition-all ease-in-out btn btn-ghost"
          >
            <LuArrowLeft
              size={16}
              className="group-hover:scale-x-120 transition-all group-hover:-translate-x-1.5 ease-in-out"
            />
            Go to home page
          </Link>
        </>
      );
    }

    return (
      <>
        <div className="flex justify-center items-center bg-status-error-bg mb-6 border border-status-error-border rounded-full w-16 h-16 text-status-error-text">
          <LuShieldQuestion size={32} />
        </div>
        <h3 className="mb-2 text-status-error-text">
          Email Verification Failed
        </h3>
        <p className="mb-4 text-status-error-text leading-relaxed">
          We were not able to verify your email, please try again!
        </p>

        <Link
          href={defaultRoutes.landing}
          className="group flex justify-center items-center gap-2 rounded-full transition-all ease-in-out btn btn-ghost"
        >
          <LuArrowLeft
            size={16}
            className="group-hover:scale-x-120 transition-all group-hover:-translate-x-1.5 ease-in-out"
          />
          Go to home page
        </Link>
      </>
    );
  };

  return (
    <AuthLayout
      title="Email Verification"
      subtitle={
        verifyEmailMutation.isSuccess
          ? "Thank you for verifying your email!"
          : "Failed to verify your email!"
      }
    >
      <div className="flex flex-col items-center py-4 text-center">
        {renderVerifyEmailContent()}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
