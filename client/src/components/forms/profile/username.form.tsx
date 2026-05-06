import { useActionState, useEffect } from "react";
import Form from "next/form";
import { LuAtSign } from "react-icons/lu";
import { initialState } from "@/config/forms.config";
import { FormStateType } from "@/types/types/actions.types";
import { UsernameFormProps } from "@/types/props/forms.props.types";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormFooter from "@/components/forms/shared/form.footer";

// TODO: replace with actual server action
const updateUsername = async (
  _prevState: FormStateType,
  _formData: FormData,
): Promise<FormStateType> => {
  return {
    status: "SUCCESS",
    success: true,
    message: "Username updated successfully!",
    code: "SUCCESS",
  };
};

const UsernameForm = ({
  isOpen,
  onClose,
  initialData = "",
  onSave,
}: UsernameFormProps) => {
  const { showToast } = useToast();

  const usernameInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      if (!val.trim()) return "Username is required";
      if (val.length < 3) return "Must be at least 3 characters";
      if (val.length > 30) return "Cannot exceed 30 characters";
      if (!/^[a-zA-Z0-9_]+$/.test(val))
        return "Only letters, numbers, and underscores allowed";
      return "";
    },
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateUsername(prevState, formData);

  const [state, usernameFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    if (isOpen) {
      usernameInput.handleInput(initialData);
    }
  }, [isOpen]);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Username updated successfully!",
        variant: "success",
      });
      onSave(usernameInput.raw);
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
      title="Update Username"
      subtitle="Your unique handle — used in your profile URL"
      maxWidth="max-w-md"
      footer={
        <FormFooter
          formType="username-form"
          onClose={onClose}
          isPending={isPending}
          isDisabled={isPending || !usernameInput.raw || !!usernameInput.error}
        />
      }
    >
      <Form id="username-form" action={usernameFormAction}>
        <div className="flex flex-col gap-3">
          <FormField
            label="Username"
            htmlFor="userName"
            error={usernameInput.error}
          >
            <FormInput
              id="userName"
              name="userName"
              placeholder="your_username"
              autoComplete="off"
              value={usernameInput.raw}
              onChange={(e) => usernameInput.handleInput(e.currentTarget.value)}
              onBlur={usernameInput.handleBlur}
              endIcon={<LuAtSign />}
              error={usernameInput.error}
            />
          </FormField>

          {usernameInput.raw && !usernameInput.error && (
            <p className="text-text-muted text-xs">
              Your profile will be at{" "}
              <span className="font-medium text-primary">
                /{usernameInput.raw}
              </span>
            </p>
          )}

          <p className="text-text-muted text-xs leading-relaxed">
            Letters, numbers, and underscores only. 3–30 characters.
          </p>
        </div>
      </Form>
    </ModalPortal>
  );
};

export default UsernameForm;
