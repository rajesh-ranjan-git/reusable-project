import { useEffect, useState } from "react";
import { GenderFormProps } from "@/types/props/forms.props.types";
import { useToast } from "@/hooks/toast";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormButton from "@/components/forms/shared/form.button";
import { FormRadioGroup } from "@/components/forms/shared/form.radio";

const GenderForm = ({
  isOpen,
  onClose,
  initialData = null,
}: GenderFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [gender, setGender] = useState(initialData);

  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setGender(initialData ?? null);
    }
  }, [isOpen]);

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Gender"
      maxWidth="max-w-lg w-max"
      footer={
        <>
          <FormButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isUpdating || !gender}
          >
            Cancel
          </FormButton>
          <FormButton
            type="button"
            variant="primary"
            loading={isUpdating}
            disabled={isUpdating || !gender}
            onClick={() => {}}
          >
            Update
          </FormButton>
        </>
      }
    >
      <FormField label="Gender" htmlFor="gender">
        <div className="mt-4 ml-2">
          <FormRadioGroup
            name="gender"
            value={gender ?? null}
            onChange={(value) => setGender(value)}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
        </div>
      </FormField>
    </ModalPortal>
  );
};

export default GenderForm;
