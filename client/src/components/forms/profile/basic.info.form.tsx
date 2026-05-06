import { useActionState, useEffect } from "react";
import Form from "next/form";
import { LuUser } from "react-icons/lu";
import { MdBadge } from "react-icons/md";
import { initialState } from "@/config/forms.config";
import { FormStateType } from "@/types/types/actions.types";
import { BasicInfoFormProps } from "@/types/props/forms.props.types";
import { nameValidator } from "@/validators/auth.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateProfile } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormFooter from "@/components/forms/shared/form.footer";

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
      if (!val) return "First name is required!";

      const { message } = nameValidator(val, "firstName");
      return message ?? "";
    },
  });

  const lastNameInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = nameValidator(val, "lastName");

      return message ?? "";
    },
  });

  const nickNameInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = nameValidator(val, "nickName");

      return message ?? "";
    },
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateProfile(prevState, formData);

  const [state, basicInfoFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    firstNameInput.reset();
    lastNameInput.reset();
    nickNameInput.reset();

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
        firstName: firstNameInput.raw
          ? firstNameInput.raw
          : initialData.firstName,
        lastName: lastNameInput.raw ? lastNameInput.raw : initialData.lastName,
        nickName: nickNameInput.raw ? nickNameInput.raw : initialData.nickName,
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
              required
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
            label="Nickname"
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
