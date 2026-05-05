import { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { EmailFormProps } from "@/types/props/forms.props.types";
import { emailValidator } from "@/validators/auth.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormButton from "@/components/forms/shared/form.button";

const EmailForm = ({ isOpen, onClose, initialData = "" }: EmailFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      emailInput.handleInput(initialData || "");
    }
  }, [isOpen]);

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Email"
      maxWidth="max-w-lg"
      footer={
        <>
          <FormButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isUpdating || !emailInput?.raw}
          >
            Cancel
          </FormButton>
          <FormButton
            type="button"
            variant="primary"
            loading={isUpdating}
            disabled={isUpdating || !emailInput?.raw}
            onClick={() => {}}
          >
            Update
          </FormButton>
        </>
      }
    >
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
    </ModalPortal>
  );
};

export default EmailForm;
