import { useActionState, useEffect } from "react";
import Form from "next/form";
import { initialState } from "@/config/forms.config";
import { GenderFormProps } from "@/types/props/forms.props.types";
import { FormStateType } from "@/types/types/actions.types";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateGender } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import { FormRadioGroup } from "@/components/forms/shared/form.radio";
import FormFooter from "@/components/forms/shared/form.footer";

const GenderForm = ({
  isOpen,
  onClose,
  initialData = null,
  onSave,
}: GenderFormProps) => {
  const { showToast } = useToast();

  const genderInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      if (!["male", "female", "other"].includes(val))
        return "Please provide a valid gender!";

      return "";
    },
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateGender(prevState, formData);

  const [state, genderFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    genderInput.reset();

    if (isOpen) {
      genderInput.handleInput(initialData || "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Gender updated successfully!",
        variant: "success",
      });
      onSave(genderInput.raw);
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
      title="Update Gender"
      maxWidth="max-w-lg w-max"
      footer={
        <FormFooter
          formType="gender-form"
          onClose={onClose}
          isPending={isPending}
          isDisabled={isPending || !genderInput.raw}
        />
      }
    >
      <Form id="gender-form" action={genderFormAction}>
        <div className="min-w-72">
          <FormField label="Gender" htmlFor="gender">
            <div className="mt-4 ml-2">
              <FormRadioGroup
                name="gender"
                value={genderInput.raw ?? null}
                onChange={genderInput.handleInput}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
              />
            </div>
          </FormField>
        </div>
      </Form>
    </ModalPortal>
  );
};

export default GenderForm;
