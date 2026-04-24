import { useEffect, useActionState } from "react";
import Form from "next/form";
import { LuUser } from "react-icons/lu";
import { FormStateType } from "@/types/types/actions.types";
import { BioFormProps } from "@/types/props/forms.props.types";
import { initialState } from "@/config/forms.config";
import { propertyConstraintsConfig } from "@/config/profile.config";
import { toTitleCase } from "@/utils/common.utils";
import { validateBio } from "@/validators/profile.validators";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateProfile } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormFooter from "@/components/forms/shared/form.footer";
import FormField from "@/components/forms/shared/form.field";
import FormTextarea from "@/components/forms/shared/form.textarea";

const BioForm = ({
  isOpen,
  onClose,
  initialData = "",
  onSave,
}: BioFormProps) => {
  const { showToast } = useToast();

  const bioInput = useInputFieldValidator<string>({
    initialValue: initialData ?? "",
    validate: validateBio,
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateProfile(prevState, formData);

  const [state, bioFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    if (isOpen) {
      bioInput.handleInput(initialData || "");
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
      onSave(bioInput.raw);
      onClose();
    } else {
      showToast({
        title: state.code,
        message: state.message,
        variant: "error",
      });
    }
  }, [state]);

  const remaining =
    propertyConstraintsConfig.maxBioLength - bioInput.raw.length;
  const isNearLimit = remaining <= 40;

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Bio"
      subtitle="Write a short bio that appears on your profile"
      maxWidth="max-w-lg"
      footer={
        <FormFooter
          formType="bio-form"
          onClose={onClose}
          isPending={
            isPending ||
            bioInput?.raw.trim().length < propertyConstraintsConfig.minBioLength
          }
        />
      }
    >
      <div className="space-y-3">
        <Form id="bio-form" action={bioFormAction}>
          <div className="flex gap-3 bg-glass-bg-subtle p-4 border border-glass-border rounded-md">
            <LuUser size={16} className="mt-0.5 text-accent-purple shrink-0" />
            <p className="text-text-muted text-xs leading-relaxed">
              Tip: Mention your current role, key expertise, and something that
              makes you stand out. Keep it concise and professional.
            </p>
          </div>

          <FormField label="Bio" htmlFor="bio" error={bioInput.error}>
            <FormTextarea
              id="bio"
              name="bio"
              rows={6}
              placeholder="e.g. Full Stack Developer @ India Today Group | Passionate about building beautiful, scalable web apps with Next.js and TypeScript 🚀"
              autoComplete="off"
              value={bioInput.raw}
              onChange={(e) => bioInput.handleInput(e.currentTarget.value)}
              onBlur={bioInput.handleBlur}
              error={bioInput.error}
            />
          </FormField>

          <div className="flex justify-end">
            <span
              className={`text-xs font-medium tabular-nums transition-colors ${
                isNearLimit
                  ? remaining <= 10
                    ? "text-status-error-text"
                    : "text-status-warning-text"
                  : "text-text-muted"
              }`}
            >
              {remaining} / {propertyConstraintsConfig.maxBioLength}
            </span>
          </div>

          {bioInput.raw && bioInput.raw.trim() && (
            <div className="mt-2">
              <p className="mb-2 font-semibold text-[10px] text-text-muted uppercase tracking-widest">
                Preview
              </p>
              <div className="p-4 text-text-secondary text-sm wrap-break-word leading-relaxed glass">
                {bioInput.raw.trim().split("\n").length > 0
                  ? bioInput.raw
                      .trim()
                      .split("\n")
                      .map((bio, idx) => (
                        <p key={`${bio.length}-${idx}`}>{toTitleCase(bio)}</p>
                      ))
                  : toTitleCase(bioInput.raw.trim())}
              </div>
            </div>
          )}
        </Form>
      </div>
    </ModalPortal>
  );
};

export default BioForm;
