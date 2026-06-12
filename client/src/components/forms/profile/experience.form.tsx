import { useState, useEffect, useActionState } from "react";
import Form from "next/form";
import { LuPlus, LuTrash2, LuBriefcase } from "react-icons/lu";
import {
  emptyExperienceConfig,
  propertyConstraintsConfig,
} from "@/config/profile.config";
import { initialState } from "@/config/forms.config";
import { ExperienceType } from "@/types/types/profile.types";
import { FormStateType, SectionErrorsType } from "@/types/types/actions.types";
import { ExperienceFormProps } from "@/types/props/forms.props.types";
import {
  datePropertyValidator,
  stringPropertiesValidator,
} from "@/validators/common.validators";
import { normalizeExperienceDates } from "@/helpers/profile.helpers";
import { formatLocalDate } from "@/utils/date.utils";
import { useToast } from "@/hooks/toast";
import useInputFieldValidator from "@/hooks/useInputFieldValidation";
import { updateExperience } from "@/lib/actions/profile.actions";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormTextarea from "@/components/forms/shared/form.textarea";
import FormCheckbox from "@/components/forms/shared/form.checkbox";
import FormButton from "@/components/forms/shared/form.button";
import FormDivider from "@/components/forms/shared/form.divider";
import FormDatePicker from "@/components/forms/shared/form.date.picker";
import FormFooter from "@/components/forms/shared/form.footer";

const ExperienceForm = ({
  isOpen,
  onClose,
  initialData = [],
  joined,
  onSave,
}: ExperienceFormProps) => {
  const [entries, setEntries] = useState<ExperienceType[]>(
    initialData.length > 0
      ? normalizeExperienceDates(initialData)
      : [emptyExperienceConfig],
  );
  const [errors, setErrors] = useState<SectionErrorsType<ExperienceType>[]>([]);

  const { showToast } = useToast();

  const companyInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = stringPropertiesValidator(
        "company",
        val,
        propertyConstraintsConfig.minStringLength,
        propertyConstraintsConfig.maxStringLength,
      );

      return message ?? "";
    },
  });

  const roleInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = stringPropertiesValidator(
        "role",
        val,
        propertyConstraintsConfig.minStringLength,
        propertyConstraintsConfig.maxStringLength,
      );

      return message ?? "";
    },
  });

  const startDateInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = datePropertyValidator("start date", val);

      return message ?? "";
    },
  });

  const endDateInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = datePropertyValidator("end date", val);

      return message ?? "";
    },
  });

  const descriptionInput = useInputFieldValidator<string>({
    initialValue: "",
    validate: (val: string) => {
      const { message } = stringPropertiesValidator(
        "description",
        val,
        propertyConstraintsConfig.minStringLength,
        propertyConstraintsConfig.maxStringLength,
      );

      return message ?? "";
    },
  });

  const action = async (
    prevState: FormStateType,
    formData: FormData,
  ): Promise<FormStateType> => updateExperience(prevState, formData);

  const [state, experienceFormAction, isPending] = useActionState(
    action,
    initialState,
  );

  const updateEntry = <K extends keyof ExperienceType>(
    idx: number,
    key: K,
    value: ExperienceType[K],
  ) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === idx
          ? {
              ...e,
              [key]: value,
              ...(key === "isCurrent" && value === true
                ? { endDate: null }
                : {}),
            }
          : e,
      ),
    );

    setErrors((prev) => {
      const next = [...(prev ?? [])];
      if (next[idx]) delete next[idx][key];
      return next;
    });
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, emptyExperienceConfig]);
    setErrors((prev) => [...prev, {}]);
  };

  const removeEntry = (idx: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    if (state && state.status === "IDLE") return;

    if (!state?.success) {
      showToast({
        title: state.code,
        message: state.message,
        variant: "error",
      });

      if (state?.details?.errors) {
        setErrors(state.details.errors);
      }
    } else {
      showToast({
        title: state.status,
        message: state.message!,
        variant: "success",
      });
    }

    onSave(entries);
    onClose();
  }, [state]);

  useEffect(() => {
    if (isOpen) {
      setEntries(
        initialData.length > 0
          ? normalizeExperienceDates(initialData)
          : [emptyExperienceConfig],
      );
      setErrors([]);
    }
  }, [isOpen]);

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Work Experience"
      subtitle="Add or edit your professional history"
      maxWidth="max-w-2xl"
      footer={
        <FormFooter
          formType="experience-form"
          onClose={onClose}
          isPending={isPending}
          isDisabled={isPending}
        />
      }
    >
      <Form
        action={experienceFormAction}
        id="experience-form"
        autoComplete="off"
      >
        <div className="space-y-6">
          {entries.map((exp, idx) => (
            <div key={idx} className="relative p-5 glass">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-text-secondary">
                  <LuBriefcase size={15} />
                  <span className="font-semibold text-xs uppercase tracking-wide">
                    Experience {entries.length > 1 ? `#${idx + 1}` : ""}
                  </span>
                </div>
                {entries.length > 1 && (
                  <FormButton
                    variant="danger"
                    size="sm"
                    onClick={() => removeEntry(idx)}
                  >
                    <LuTrash2 size={13} />
                    Remove
                  </FormButton>
                )}
              </div>

              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                <FormField
                  label="Company"
                  htmlFor={`company-${idx}`}
                  required
                  error={companyInput.error}
                >
                  <FormInput
                    id={`company-${idx}`}
                    name={`company-${idx}`}
                    placeholder="e.g. India Today Group"
                    autoComplete="off"
                    value={exp.company || ""}
                    onChange={(e) => {
                      const val = e.currentTarget.value;
                      companyInput.handleInput(val);

                      if (!companyInput.error) {
                        updateEntry(idx, "company", val);
                      }
                    }}
                    onBlur={companyInput.handleBlur}
                    error={companyInput.error}
                  />
                </FormField>

                <FormField
                  label="Role / Title"
                  htmlFor={`role-${idx}`}
                  required
                  error={roleInput.error}
                >
                  <FormInput
                    id={`role-${idx}`}
                    name={`role-${idx}`}
                    placeholder="e.g. Full Stack Developer"
                    autoComplete="off"
                    value={exp.role || ""}
                    onChange={(e) => {
                      const val = e.currentTarget.value;
                      roleInput.handleInput(val);

                      if (!roleInput.error) {
                        updateEntry(idx, "role", val);
                      }
                    }}
                    onBlur={roleInput.handleBlur}
                    error={roleInput.error}
                  />
                </FormField>

                <FormField
                  label="Start Date"
                  htmlFor={`start-date-${idx}`}
                  required
                  error={startDateInput.error}
                >
                  <FormDatePicker
                    id={`start-date-${idx}`}
                    maxDate={joined ? new Date(joined) : new Date()}
                    value={exp.startDate ? new Date(exp.startDate) : null}
                    onChange={(date) => {
                      const formatted = formatLocalDate(date)!;
                      startDateInput.handleInput(formatted);

                      if (!startDateInput.error) {
                        updateEntry(idx, "startDate", formatted);
                      }
                    }}
                    error={startDateInput.error}
                  />
                </FormField>

                <FormField
                  label="End Date"
                  htmlFor={`end-date-${idx}`}
                  error={errors[idx]?.endDate}
                >
                  <FormDatePicker
                    id={`end-date-${idx}`}
                    maxDate={joined ? new Date(joined) : new Date()}
                    value={exp.endDate ? new Date(exp.endDate) : null}
                    disabled={exp.isCurrent}
                    onChange={(date) => {
                      if (entries[idx].isCurrent) return;

                      const formatted = formatLocalDate(date)!;
                      endDateInput.handleInput(formatted);

                      if (!endDateInput.error) {
                        updateEntry(idx, "endDate", formatted);
                      }
                    }}
                    error={endDateInput.error}
                  />
                </FormField>
              </div>

              <div className="mt-3">
                <FormCheckbox
                  label="I currently work here"
                  checked={exp.isCurrent}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    updateEntry(idx, "isCurrent", checked);

                    if (checked) {
                      endDateInput.handleInput("");
                      updateEntry(idx, "endDate", null);
                    }
                  }}
                />
              </div>

              <div className="mt-4">
                <FormField
                  label="Description"
                  htmlFor={`description-${idx}`}
                  hint="Briefly describe your responsibilities and achievements."
                  error={descriptionInput.error}
                >
                  <FormTextarea
                    id={`description-${idx}`}
                    name={`description-${idx}`}
                    rows={3}
                    placeholder="e.g. Full stack developer specializing in Next.js…"
                    autoComplete="off"
                    value={exp?.description || ""}
                    onChange={(e) => {
                      const val = e.currentTarget.value;
                      descriptionInput.handleInput(val);

                      if (!descriptionInput.error) {
                        updateEntry(idx, "description", val);
                      }
                    }}
                    onBlur={descriptionInput.handleBlur}
                    error={descriptionInput.error}
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>

        <FormDivider />

        <FormButton
          type="button"
          variant="secondary"
          onClick={addEntry}
          className="justify-center w-full"
        >
          <LuPlus size={15} />
          Add Another Experience
        </FormButton>

        <input
          type="hidden"
          name="experiences"
          value={JSON.stringify(entries)}
        />
      </Form>
    </ModalPortal>
  );
};

export default ExperienceForm;
