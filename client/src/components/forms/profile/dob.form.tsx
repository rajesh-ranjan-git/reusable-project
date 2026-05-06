import { useActionState, useEffect } from "react";
import Form from "next/form";
import { FaCalendarAlt } from "react-icons/fa";
import { initialState } from "@/config/forms.config";
import { DobFormProps } from "@/types/props/forms.props.types";
import { FormStateType } from "@/types/types/actions.types";
import { formatLocalDate } from "@/utils/date.utils";
import { datePropertyValidator } from "@/validators/common.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateDob } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormDatePicker from "@/components/forms/shared/form.date.picker";
import FormFooter from "@/components/forms/shared/form.footer";

const DobForm = ({
  isOpen,
  onClose,
  initialData = "",
  joined,
  onSave,
}: DobFormProps) => {
  const { showToast } = useToast();

  const dobInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = datePropertyValidator("date of birth", val);

      return message ?? "";
    },
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateDob(prevState, formData);

  const [state, dobFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    dobInput.reset();

    if (isOpen) {
      dobInput.handleInput(initialData || "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Date of birth updated successfully!",
        variant: "success",
      });
      onSave(dobInput.raw);
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
      title="Update Date of Birth"
      maxWidth="max-w-lg w-max min-h-140"
      footer={
        <FormFooter
          formType="dob-form"
          onClose={onClose}
          isPending={isPending}
          isDisabled={isPending || !dobInput.raw}
        />
      }
    >
      <Form id="dob-form" action={dobFormAction}>
        <div className="flex flex-col gap-8 min-w-72">
          <FormField label="Date of Birth" htmlFor="dob" error={dobInput.error}>
            <FormDatePicker
              id="dob"
              maxDate={joined ? new Date(joined) : new Date()}
              value={dobInput.raw ? new Date(dobInput.raw) : null}
              onChange={(date) => {
                const formatted = formatLocalDate(date)!;
                dobInput.handleInput(formatted);
              }}
              error={dobInput.error}
            />
          </FormField>

          <div className="flex flex-col justify-center items-center gap-4 w-full h-full text-text-muted">
            <FaCalendarAlt size={200} />
            <p>Select your birth date</p>
          </div>
        </div>

        <input type="hidden" name="dob" value={dobInput.raw ?? ""} />
      </Form>
    </ModalPortal>
  );
};

export default DobForm;
