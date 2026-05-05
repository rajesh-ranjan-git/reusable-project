import { useEffect, useState } from "react";
import { DobFormProps } from "@/types/props/forms.props.types";
import { formatLocalDate } from "@/utils/date.utils";
import { datePropertyValidator } from "@/validators/common.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormDatePicker from "@/components/forms/shared/form.date.picker";
import FormFooter from "@/components/forms/shared/form.footer";
import { FaCalendarAlt } from "react-icons/fa";

const DobForm = ({ isOpen, onClose, initialData = null }: DobFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [dob, setDob] = useState(initialData);

  const { showToast } = useToast();

  const dobInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = datePropertyValidator("date of birth", val);

      return message ?? "";
    },
  });

  useEffect(() => {
    if (isOpen) {
      setDob(initialData ?? null);
    }
  }, [isOpen]);

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Date Of Birth"
      maxWidth="max-w-lg w-max min-h-140"
      footer={
        <FormFooter
          formType="dob-form"
          onClose={onClose}
          isPending={isUpdating}
          isDisabled={isUpdating || !dobInput.raw}
        />
      }
    >
      <div className="flex flex-col gap-8 min-w-72">
        <FormField
          label="Date Of Birth"
          htmlFor="dob"
          required
          error={dobInput.error}
        >
          <FormDatePicker
            id="dob"
            maxDate={new Date()}
            value={dobInput.raw ? new Date(dobInput.raw) : null}
            onChange={(date) => {
              const formatted = formatLocalDate(date)!;
              dobInput.handleInput(formatted);

              if (!dobInput.error) {
              }
            }}
            error={dobInput.error}
          />
        </FormField>

        <div className="flex flex-col justify-center items-center gap-4 w-full h-full text-text-muted">
          <FaCalendarAlt size={200} />
          <p>Select your birth date</p>
        </div>
      </div>
    </ModalPortal>
  );
};

export default DobForm;
