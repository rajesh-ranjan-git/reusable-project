import { useActionState, useEffect } from "react";
import Form from "next/form";
import { LuAtSign } from "react-icons/lu";
import { initialState } from "@/config/forms.config";
import { FormStateType } from "@/types/types/actions.types";
import { UsernameFormProps } from "@/types/props/forms.props.types";
import { userNameValidator } from "@/validators/auth.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateUsername } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormFooter from "@/components/forms/shared/form.footer";

const UsernameForm = ({
  isOpen,
  onClose,
  initialData = "",
  onSave,
}: UsernameFormProps) => {
  const { showToast } = useToast();

  const userNameInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = userNameValidator(val);

      return message ?? "";
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
    userNameInput.reset();

    if (isOpen) {
      userNameInput.handleInput(initialData);
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
      onSave(userNameInput.raw);
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
          isDisabled={isPending || !userNameInput.raw || !!userNameInput.error}
        />
      }
    >
      <Form id="username-form" action={usernameFormAction}>
        <div className="flex flex-col gap-3">
          <FormField
            label="Username"
            htmlFor="userName"
            error={userNameInput.error}
          >
            <FormInput
              id="userName"
              name="userName"
              placeholder="your_username"
              autoComplete="off"
              value={userNameInput.raw}
              onChange={(e) => userNameInput.handleInput(e.currentTarget.value)}
              onBlur={userNameInput.handleBlur}
              endIcon={<LuAtSign />}
              error={userNameInput.error}
            />
          </FormField>

          {userNameInput.raw && !userNameInput.error && (
            <p className="text-text-muted text-xs">
              Your profile will be at{" "}
              <span className="font-medium text-primary">
                /{userNameInput.raw}
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
