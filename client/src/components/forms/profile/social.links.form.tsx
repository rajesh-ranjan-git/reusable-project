import { useActionState, useEffect } from "react";
import Form from "next/form";
import { initialState } from "@/config/forms.config";
import { FormStateType } from "@/types/types/actions.types";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormFooter from "@/components/forms/shared/form.footer";
import { SocialType } from "@/types/types/profile.types";
import { socialPlatformsConfig } from "@/config/profile.config";
import { SocialLinksFormProps } from "@/types/props/forms.props.types";

// TODO: replace with actual server action
const updateSocialLinks = async (
  _prevState: FormStateType,
  _formData: FormData,
): Promise<FormStateType> => {
  return {
    status: "SUCCESS",
    success: true,
    message: "Social links updated successfully!",
    code: "SUCCESS",
  };
};

const isValidUrl = (val: string): string => {
  if (!val) return "";
  try {
    new URL(val.startsWith("http") ? val : `https://${val}`);
    return "";
  } catch {
    return "Please enter a valid URL";
  }
};

const SocialLinksForm = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}: SocialLinksFormProps) => {
  const { showToast } = useToast();

  const githubInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: isValidUrl,
  });
  const linkedinInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: isValidUrl,
  });
  const twitterInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: isValidUrl,
  });
  const instagramInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: isValidUrl,
  });
  const facebookInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: isValidUrl,
  });
  const websiteInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: isValidUrl,
  });

  const inputMap: Record<
    keyof SocialType,
    ReturnType<typeof useInputFieldValidator<string>>
  > = {
    github: githubInput,
    linkedin: linkedinInput,
    twitter: twitterInput,
    instagram: instagramInput,
    facebook: facebookInput,
    website: websiteInput,
  };

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateSocialLinks(prevState, formData);

  const [state, socialFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    if (isOpen) {
      (Object.keys(inputMap) as (keyof SocialType)[]).forEach((key) => {
        inputMap[key].handleInput(initialData?.[key] ?? "");
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (state?.success) {
      showToast({
        title: state.status,
        message: state.message ?? "Social links updated successfully!",
        variant: "success",
      });
      const updated: SocialType = {};
      (Object.keys(inputMap) as (keyof SocialType)[]).forEach((key) => {
        const val = inputMap[key].raw.trim();
        if (val) updated[key] = val;
      });
      onSave(updated);
      onClose();
    } else {
      showToast({
        title: state.code,
        message: state.message,
        variant: "error",
      });
    }
  }, [state]);

  const hasAnyError = (
    Object.values(inputMap) as ReturnType<
      typeof useInputFieldValidator<string>
    >[]
  ).some((inp) => !!inp.error);

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Social Links"
      subtitle="Add links to your profiles and website"
      maxWidth="max-w-lg"
      footer={
        <FormFooter
          formType="social-links-form"
          onClose={onClose}
          isPending={isPending}
          isDisabled={isPending || hasAnyError}
        />
      }
    >
      <Form id="social-links-form" action={socialFormAction}>
        <div className="flex flex-col gap-4">
          {socialPlatformsConfig.map(({ name, Icon, label }) => {
            const key = name as keyof SocialType;
            const input = inputMap[key];
            if (!input) return null;

            return (
              <FormField
                key={name}
                label={
                  <span className="flex items-center gap-2">
                    <Icon size={14} className="text-text-muted" />
                    {label}
                  </span>
                }
                htmlFor={name}
                error={input.error}
              >
                <FormInput
                  id={name}
                  name={name}
                  placeholder={
                    name === "website"
                      ? "https://yoursite.com"
                      : `https://${name}.com/yourhandle`
                  }
                  autoComplete="off"
                  value={input.raw}
                  onChange={(e) => input.handleInput(e.currentTarget.value)}
                  onBlur={input.handleBlur}
                  error={input.error}
                />
              </FormField>
            );
          })}
        </div>
      </Form>
    </ModalPortal>
  );
};

export default SocialLinksForm;
