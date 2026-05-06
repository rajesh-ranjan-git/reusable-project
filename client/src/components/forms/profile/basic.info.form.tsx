import { useActionState, useEffect } from "react";
import Form from "next/form";
import { LuUser } from "react-icons/lu";
import { MdBadge } from "react-icons/md";
import { initialState } from "@/config/forms.config";
import { FormStateType } from "@/types/types/actions.types";
import { BasicInfoFormProps } from "@/types/props/forms.props.types";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormFooter from "@/components/forms/shared/form.footer";

// TODO: replace with actual server action
const updateBasicInfo = async (
  _prevState: FormStateType,
  _formData: FormData,
): Promise<FormStateType> => {
  return {
    status: "SUCCESS",
    success: true,
    message: "Profile updated successfully!",
    code: "SUCCESS",
  };
};

const BasicInfoForm = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}: BasicInfoFormProps) => {
  const { showToast } = useToast();

  const firstNameInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      if (!val.trim()) return "First name is required";
      if (val.trim().length < 2) return "Must be at least 2 characters";
      return "";
    },
  });

  const lastNameInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      if (val.trim() && val.trim().length < 2)
        return "Must be at least 2 characters";
      return "";
    },
  });

  const nickNameInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: () => "",
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateBasicInfo(prevState, formData);

  const [state, basicInfoFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    if (isOpen) {
      firstNameInput.handleInput(initialData?.firstName ?? "");
      lastNameInput.handleInput(initialData?.lastName ?? "");
      nickNameInput.handleInput(initialData?.nickName ?? "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Profile updated successfully!",
        variant: "success",
      });
      onSave({
        firstName: firstNameInput.raw,
        lastName: lastNameInput.raw,
        nickName: nickNameInput.raw,
      });
      onClose();
    } else {
      showToast({
        title: state.code,
        message: state.message,
        variant: "error",
      });
    }
  }, [state]);

  const isDisabled =
    isPending ||
    !firstNameInput.raw ||
    !!firstNameInput.error ||
    !!lastNameInput.error;

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Name & Nickname"
      subtitle="How you appear on your profile"
      maxWidth="max-w-lg"
      footer={
        <FormFooter
          formType="basic-info-form"
          onClose={onClose}
          isPending={isPending}
          isDisabled={isDisabled}
        />
      }
    >
      <Form id="basic-info-form" action={basicInfoFormAction}>
        <div className="flex flex-col gap-4">
          <div className="gap-3 grid grid-cols-2">
            <FormField
              label="First Name"
              htmlFor="firstName"
              error={firstNameInput.error}
            >
              <FormInput
                id="firstName"
                name="firstName"
                placeholder="John"
                autoComplete="off"
                value={firstNameInput.raw}
                onChange={(e) =>
                  firstNameInput.handleInput(e.currentTarget.value)
                }
                onBlur={firstNameInput.handleBlur}
                endIcon={<LuUser />}
                error={firstNameInput.error}
              />
            </FormField>

            <FormField
              label="Last Name"
              htmlFor="lastName"
              error={lastNameInput.error}
            >
              <FormInput
                id="lastName"
                name="lastName"
                placeholder="Doe"
                autoComplete="off"
                value={lastNameInput.raw}
                onChange={(e) =>
                  lastNameInput.handleInput(e.currentTarget.value)
                }
                onBlur={lastNameInput.handleBlur}
                endIcon={<LuUser />}
                error={lastNameInput.error}
              />
            </FormField>
          </div>

          <FormField
            label={
              <span className="flex items-center gap-1.5">
                Nickname
                <span className="font-normal text-text-muted text-xs">
                  (optional)
                </span>
              </span>
            }
            htmlFor="nickName"
            error={nickNameInput.error}
          >
            <FormInput
              id="nickName"
              name="nickName"
              placeholder="e.g. &ldquo;Rocky&rdquo;"
              autoComplete="off"
              value={nickNameInput.raw}
              onChange={(e) => nickNameInput.handleInput(e.currentTarget.value)}
              onBlur={nickNameInput.handleBlur}
              endIcon={<MdBadge />}
              error={nickNameInput.error}
            />
          </FormField>
        </div>
      </Form>
    </ModalPortal>
  );
};

export default BasicInfoForm;
