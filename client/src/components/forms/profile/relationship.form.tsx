import { useEffect, useState } from "react";
import { RelationshipFormProps } from "@/types/props/forms.props.types";
import { useToast } from "@/hooks/toast";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import { FormRadioGroup } from "@/components/forms/shared/form.radio";
import FormFooter from "@/components/forms/shared/form.footer";

const RelationshipForm = ({
  isOpen,
  onClose,
  initialData = null,
}: RelationshipFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState(initialData);

  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setMaritalStatus(initialData ?? null);
    }
  }, [isOpen]);

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
          isPending={isUpdating}
          isDisabled={isUpdating || !maritalStatus}
        />
      }
    >
      <FormField label="Marital Status" htmlFor="maritalStatus">
        <div className="mt-4 ml-2">
          <FormRadioGroup
            name="maritalStatus"
            value={maritalStatus ?? null}
            onChange={(value) => setMaritalStatus(value)}
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
    </ModalPortal>
  );
};

export default RelationshipForm;
