"use client";

import { SubmitEvent, useState } from "react";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import { LuArrowLeft } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import AuthLayout from "@/components/auth/authLayout";
import { authRoutes } from "@/lib/routes/routes";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you instructions to reset your password"
    >
      {success ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="flex justify-center items-center bg-status-success-bg mb-6 border border-status-success-border rounded-full w-16 h-16 text-status-success-text">
            <FiCheckCircle size={32} />
          </div>
          <h3 className="mb-2">Check your email</h3>
          <p className="mb-4 text-text-secondary leading-relaxed">
            We've sent a password reset link to{" "}
            <span className="font-medium text-white">{email}</span>. Click the
            link to set a new password.
          </p>

          <Link
            href={authRoutes.login}
            className="flex justify-center items-center gap-2 mt-8 text-text-secondary hover:text-text-primary text-sm hover:scale-105 transition-colors"
          >
            <LuArrowLeft size={16} />
            Back to log in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col">
          <div className="flex flex-col gap-1 mb-2">
            <label className="mb-2">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 py-3 w-full font-semibold text-text-on-accent uppercase tracking-wider transition-all disabled:cursor-not-allowed btn btn-primary"
          >
            {loading ? (
              <TbLoader3 size={20} className="animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </button>

          <Link
            href={authRoutes.login}
            className="flex justify-center items-center gap-2 mt-8 text-text-secondary hover:text-text-primary text-sm hover:scale-105 transition-colors"
          >
            <LuArrowLeft size={16} />
            Back to log in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
