import { useActionState, useEffect } from "react";
import Form from "next/form";
import { FaPhone } from "react-icons/fa";
import { PHONE_REGEX } from "@/constants/regex.constants";
import { initialState } from "@/config/forms.config";
import { PhoneFormProps } from "@/types/props/forms.props.types";
import { FormStateType } from "@/types/types/actions.types";
import { numberRegexPropertiesValidator } from "@/validators/common.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updatePhone } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormFooter from "@/components/forms/shared/form.footer";

const PhoneForm = ({
  isOpen,
  onClose,
  initialData = "",
  onSave,
}: PhoneFormProps) => {
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

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updatePhone(prevState, formData);

  const [state, phoneFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    phoneInput.reset();

    if (isOpen) {
      phoneInput.handleInput(initialData || "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Phone number updated successfully!",
        variant: "success",
      });
      onSave(phoneInput.raw);
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
      title="Update Phone"
      maxWidth="max-w-lg w-max"
      footer={
        <FormFooter
          formType="phone-form"
          onClose={onClose}
          isPending={isPending}
          isDisabled={isPending || !phoneInput?.raw}
        />
      }
    >
      <Form id="phone-form" action={phoneFormAction}>
        <div className="min-w-72">
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
        </div>
      </Form>
    </ModalPortal>
  );
};

export default PhoneForm;
