import { useActionState, useEffect } from "react";
import Form from "next/form";
import { MdEmail } from "react-icons/md";
import { initialState } from "@/config/forms.config";
import { EmailFormProps } from "@/types/props/forms.props.types";
import { FormStateType } from "@/types/types/actions.types";
import { emailValidator } from "@/validators/auth.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateEmail } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormFooter from "@/components/forms/shared/form.footer";

const EmailForm = ({
  isOpen,
  onClose,
  initialData = "",
  onSave,
}: EmailFormProps) => {
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
  ): Promise<FormStateType> => updateEmail(prevState, formData);

  const [state, emailFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    emailInput.reset();

    if (isOpen) {
      emailInput.handleInput(initialData || "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Email updated successfully!",
        variant: "success",
      });
      onSave(emailInput.raw);
      onClose();
    } else {
      showToast({
        title: state.code,
        message: state.message,
        variant: "error",
      });
    }
  }, [state]);

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Email"
      maxWidth="max-w-lg"
      footer={
        <FormFooter
          formType="email-form"
          onClose={onClose}
          isPending={isPending}
          isDisabled={isPending || !emailInput?.raw}
        />
      }
    >
      <Form id="email-form" action={emailFormAction}>
        <FormField label="Email" htmlFor="email" error={emailInput.error}>
          <FormInput
            id="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="off"
            value={emailInput.raw}
            onChange={(e) => emailInput.handleInput(e.currentTarget.value)}
            onBlur={emailInput.handleBlur}
            endIcon={<MdEmail />}
            error={emailInput.error}
          />
        </FormField>
      </Form>
    </ModalPortal>
  );
};

export default EmailForm;
