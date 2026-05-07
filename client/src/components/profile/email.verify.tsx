import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { LuAlarmClock } from "react-icons/lu";
import { MdOutlineError } from "react-icons/md";
import { EmailVerificationModalProps } from "@/types/props/forms.props.types";
import { emailValidator } from "@/validators/auth.validators";
import { useToast } from "@/hooks/toast";
import { resendVerificationEmail } from "@/lib/actions/auth.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormButton from "@/components/forms/shared/form.button";

const EmailVerificationModal = ({
  isOpen,
  onClose,
  email,
}: EmailVerificationModalProps) => {
  const [isSending, setIsSending] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);

  const { showToast } = useToast();

  const sendVerificationEmail = async (email: string) => {
    const { isEmailValid, validatedEmail, message } = emailValidator(email);

    if (!isEmailValid) {
      onClose();

      showToast({
        title: "EMAIL VERIFICATION FAILED",
        message: message ?? "Please provide a valid email!",
        variant: "error",
      });

      return;
    }
    const sendVerificationEmailResponse = await resendVerificationEmail(
      validatedEmail as string,
    );

    if (!sendVerificationEmailResponse.success) {
      onClose();

      showToast({
        title: sendVerificationEmailResponse.code,
        message: sendVerificationEmailResponse.message,
        variant: "error",
      });
    } else {
      setIsVerificationEmailSent(true);
    }

    setIsSending(false);
  };

  useEffect(() => {
    if (isOpen && email) {
      setIsSending(true);
      sendVerificationEmail(email);
    } else {
      onClose();
    }
  }, [isOpen, email]);

  if (!email || !isOpen) return;

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isSending
          ? "Sending Verification Link"
          : isVerificationEmailSent
            ? "Email Verification Link Sent"
            : "Email Verification Failed"
      }
      maxWidth="max-w-lg"
    >
      {isSending ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="flex justify-center items-center bg-status-warning-bg mb-6 border border-status-warning-border rounded-full w-16 h-16 text-status-warning-text">
            <LuAlarmClock size={32} />
          </div>
          <h3 className="mb-2">Sending verification email</h3>
          <p className="text-text-secondary leading-relaxed">
            <span>
              Please wait while we are sending an email verification link to
              your email:&nbsp;
            </span>
            <span className="font-medium text-white">{email}</span>.
          </p>
        </div>
      ) : isVerificationEmailSent ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="flex justify-center items-center bg-status-success-bg mb-6 border border-status-success-border rounded-full w-16 h-16 text-status-success-text">
            <FiCheckCircle size={32} />
          </div>
          <h3 className="mb-2">Check your email</h3>
          <p className="text-text-secondary leading-relaxed">
            <span>
              We've sent an email verification link to your email:&nbsp;
            </span>
            <span className="font-medium text-white">{email}</span>. Click the
            link to verify your email.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="flex justify-center items-center bg-status-error-bg mb-6 border border-status-error-border rounded-full w-16 h-16 text-status-error-text">
            <MdOutlineError size={32} />
          </div>
          <h3 className="mb-2 text-status-error-text">
            Email verification link not sent
          </h3>
          <p className="text-status-error-text leading-relaxed">
            <span>
              We've were not able to send email verification link to your
              email:&nbsp;
            </span>
            <span className="font-medium text-white">{email}</span>. Please try
            again later.
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <FormButton
          type="button"
          variant="ghost"
          onClick={onClose}
          loading={isSending}
          disabled={isSending}
        >
          Close
        </FormButton>
      </div>
    </ModalPortal>
  );
};

export default EmailVerificationModal;
