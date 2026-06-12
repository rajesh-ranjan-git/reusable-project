import { useActionState, useEffect } from "react";
import Form from "next/form";
import { initialState } from "@/config/forms.config";
import { RelationshipFormProps } from "@/types/props/forms.props.types";
import { FormStateType } from "@/types/types/actions.types";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateProfile } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import { FormRadioGroup } from "@/components/forms/shared/form.radio";
import FormFooter from "@/components/forms/shared/form.footer";

const RelationshipForm = ({
  isOpen,
  onClose,
  initialData = "",
  onSave,
}: RelationshipFormProps) => {
  const { showToast } = useToast();

  const relationshipInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      if (
        !["married", "single", "separated", "divorced", "complicated"].includes(
          val,
        )
      )
        return "Please provide a valid relationship status!";

      return "";
    },
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateProfile(prevState, formData);

  const [state, relationshipFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    relationshipInput.reset();

    if (isOpen) {
      relationshipInput.handleInput(initialData || "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Marital status updated successfully!",
        variant: "success",
      });
      onSave(relationshipInput.raw);
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
      title="Update Relationship Status"
      maxWidth="max-w-lg w-max"
      footer={
        <FormFooter
          formType="relationship-form"
          onClose={onClose}
          isPending={isPending}
          isDisabled={isPending || !relationshipInput.raw}
        />
      }
    >
      <Form id="relationship-form" action={relationshipFormAction}>
        <FormField label="Marital Status" htmlFor="maritalStatus">
          <div className="mt-4 ml-2">
            <FormRadioGroup
              name="maritalStatus"
              value={relationshipInput.raw ?? null}
              onChange={relationshipInput.handleInput}
              options={[
                { label: "Single", value: "single" },
                { label: "Married", value: "married" },
                { label: "Separated", value: "separated" },
                { label: "Divorced", value: "divorced" },
                { label: "Complicated", value: "complicated" },
              ]}
            />
          </div>
        </FormField>
      </Form>
    </ModalPortal>
  );
};

export default RelationshipForm;
