import { useActionState, useEffect } from "react";
import Form from "next/form";
import { initialState } from "@/config/forms.config";
import { socialPlatformsConfig } from "@/config/profile.config";
import { FormStateType } from "@/types/types/actions.types";
import { SocialType } from "@/types/types/profile.types";
import { SocialLinksFormProps } from "@/types/props/forms.props.types";
import { regexPropertiesValidator } from "@/validators/common.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateSocialLinks } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormFooter from "@/components/forms/shared/form.footer";

const SocialLinksForm = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}: SocialLinksFormProps) => {
  const { showToast } = useToast();

  const facebookInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = regexPropertiesValidator(
        "facebook",
        val,
        socialPlatformsConfig.filter(
          (platform) => platform.name === "facebook",
        )[0].regex,
      );

      return message ?? "";
    },
  });

  const instagramInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = regexPropertiesValidator(
        "instagram",
        val,
        socialPlatformsConfig.filter(
          (platform) => platform.name === "instagram",
        )[0].regex,
      );

      return message ?? "";
    },
  });

  const twitterInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = regexPropertiesValidator(
        "twitter",
        val,
        socialPlatformsConfig.filter(
          (platform) => platform.name === "twitter",
        )[0].regex,
      );

      return message ?? "";
    },
  });

  const githubInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = regexPropertiesValidator(
        "github",
        val,
        socialPlatformsConfig.filter(
          (platform) => platform.name === "github",
        )[0].regex,
      );

      return message ?? "";
    },
  });

  const linkedinInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = regexPropertiesValidator(
        "linkedin",
        val,
        socialPlatformsConfig.filter(
          (platform) => platform.name === "linkedin",
        )[0].regex,
      );

      return message ?? "";
    },
  });

  const youtubeInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = regexPropertiesValidator(
        "youtube",
        val,
        socialPlatformsConfig.filter(
          (platform) => platform.name === "youtube",
        )[0].regex,
      );

      return message ?? "";
    },
  });

  const websiteInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = regexPropertiesValidator(
        "website",
        val,
        socialPlatformsConfig.filter(
          (platform) => platform.name === "website",
        )[0].regex,
      );

      return message ?? "";
    },
  });

  const inputMap: Record<
    keyof SocialType,
    ReturnType<typeof useInputFieldValidator<string>>
  > = {
    facebook: facebookInput,
    instagram: instagramInput,
    twitter: twitterInput,
    github: githubInput,
    linkedin: linkedinInput,
    youtube: youtubeInput,
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
    facebookInput.reset();
    instagramInput.reset();
    twitterInput.reset();
    githubInput.reset();
    linkedinInput.reset();
    youtubeInput.reset();
    websiteInput.reset();

    if (isOpen) {
      facebookInput.handleInput(initialData?.facebook ?? "");
      instagramInput.handleInput(initialData?.instagram ?? "");
      twitterInput.handleInput(initialData?.twitter ?? "");
      githubInput.handleInput(initialData?.github ?? "");
      linkedinInput.handleInput(initialData?.linkedin ?? "");
      youtubeInput.handleInput(initialData?.youtube ?? "");
      websiteInput.handleInput(initialData?.website ?? "");
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

      const updated: SocialType = {
        facebook: facebookInput.raw?.trim() ?? "",
        instagram: instagramInput.raw?.trim() ?? "",
        twitter: twitterInput.raw?.trim() ?? "",
        github: githubInput.raw?.trim() ?? "",
        linkedin: linkedinInput.raw?.trim() ?? "",
        youtube: youtubeInput.raw?.trim() ?? "",
        website: websiteInput.raw?.trim() ?? "",
      };

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
