import { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa";
import { PHONE_REGEX } from "@/constants/regex.constants";
import { PhoneFormProps } from "@/types/props/forms.props.types";
import { numberRegexPropertiesValidator } from "@/validators/common.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormFooter from "@/components/forms/shared/form.footer";

const PhoneForm = ({ isOpen, onClose, initialData = "" }: PhoneFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const { showToast } = useToast();

  const phoneInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { isPropertyValid: isPhoneValid, message } =
        numberRegexPropertiesValidator("phone", val, PHONE_REGEX);

      if (!isPhoneValid)
        return message ?? "Please provide a valid phone number!";

      return "";
    },
  });

  useEffect(() => {
    if (isOpen) {
      phoneInput.handleInput(initialData || "");
    }
  }, [isOpen]);

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Phone"
      maxWidth="max-w-lg w-max"
      footer={
        <FormFooter
          formType="phone-form"
          onClose={onClose}
          isPending={isUpdating}
          isDisabled={isUpdating || !phoneInput?.raw}
        />
      }
    >
      <FormField label="Phone" htmlFor="phone" error={phoneInput.error}>
        <FormInput
          id="phone"
          name="phone"
          inputMode="numeric"
          numericOnly
          maxDigits={10}
          placeholder="9876543210"
          autoComplete="off"
          value={phoneInput.raw}
          onChange={(e) => phoneInput.handleInput(e.currentTarget.value)}
          onBlur={phoneInput.handleBlur}
          endIcon={<FaPhone />}
          error={phoneInput.error}
        />
      </FormField>
    </ModalPortal>
  );
};

export default PhoneForm;
