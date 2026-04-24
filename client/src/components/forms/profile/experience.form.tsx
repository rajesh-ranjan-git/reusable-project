import { useState, useEffect } from "react";
import { LuPlus, LuTrash2, LuBriefcase } from "react-icons/lu";
import { formatLocalDate } from "@/utils/date.utils";
import { ExperienceType } from "@/types/types/profile.types";
import { SectionErrorsType } from "@/types/types/actions.types";
import { ExperienceFormProps } from "@/types/props/forms.props.types";
import { emptyExperienceConfig } from "@/config/profile.config";
import { validateExperience } from "@/validators/profile.validators";
import ModalPortal from "@/components/forms/shared/form.modal";
import FormField from "@/components/forms/shared/form.field";
import FormInput from "@/components/forms/shared/form.input";
import FormTextarea from "@/components/forms/shared/form.textarea";
import FormCheckbox from "@/components/forms/shared/form.checkbox";
import FormButton from "@/components/forms/shared/form.button";
import FormDivider from "@/components/forms/shared/form.divider";
import FormDatePicker from "@/components/forms/shared/form.date.picker";

const ExperienceForm = ({
  isOpen,
  onClose,
  initialData = [],
  onSave,
}: ExperienceFormProps) => {
  const [entries, setEntries] = useState<ExperienceType[]>(
    initialData.length > 0 ? initialData : [emptyExperienceConfig],
  );
  const [errors, setErrors] = useState<SectionErrorsType<ExperienceType>[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEntries(
        initialData.length > 0 ? initialData : [emptyExperienceConfig],
      );
      setErrors([]);
    }
  }, [isOpen]);

  const update = <K extends keyof ExperienceType>(
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

      if (next[idx]) {
        delete next[idx][key];
      }

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

  const handleSave = async () => {
    const allErrors = entries.map(validateExperience);
    const hasErrors = allErrors.some((e) => Object.keys(e).length > 0);
    if (hasErrors) {
      setErrors(allErrors);
      return;
    }
    setSaving(true);
    try {
      await onSave(entries);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Work Experience"
      subtitle="Add or edit your professional history"
      maxWidth="max-w-2xl"
      footer={
        <>
          <FormButton variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </FormButton>
          <FormButton variant="primary" onClick={handleSave} loading={saving}>
            Save Changes
          </FormButton>
        </>
      }
    >
      <div className="space-y-6">
        {entries.map((exp, idx) => (
          <div key={idx} className="relative p-5 glass">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-text-secondary">
                <LuBriefcase size={15} />
                <span className="font-semibold text-xs uppercase tracking-wider">
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
                error={errors[idx]?.company}
              >
                <FormInput
                  id={`company-${idx}`}
                  placeholder="e.g. India Today Group"
                  value={exp.company}
                  onChange={(e) => update(idx, "company", e.target.value)}
                  error={errors[idx]?.company}
                />
              </FormField>

              <FormField
                label="Role / Title"
                htmlFor={`role-${idx}`}
                required
                error={errors[idx]?.role}
              >
                <FormInput
                  id={`role-${idx}`}
                  placeholder="e.g. Full Stack Developer"
                  value={exp.role}
                  onChange={(e) => update(idx, "role", e.target.value)}
                  error={errors[idx]?.role}
                />
              </FormField>

              <FormField
                label="Start Date"
                htmlFor={`startDate-${idx}`}
                required
                error={errors[idx]?.startDate}
              >
                <FormDatePicker
                  id={`startDate-${idx}`}
                  value={exp.startDate ? new Date(exp.startDate) : null}
                  onChange={(date) =>
                    update(idx, "startDate", formatLocalDate(date) ?? "")
                  }
                  error={errors[idx]?.startDate}
                />
              </FormField>

              <FormField
                label="End Date"
                htmlFor={`endDate-${idx}`}
                error={errors[idx]?.endDate}
              >
                <FormDatePicker
                  id={`endDate-${idx}`}
                  disabled={exp.isCurrent}
                  value={exp.endDate ? new Date(exp.endDate) : null}
                  onChange={(date) =>
                    update(idx, "endDate", formatLocalDate(date) ?? "")
                  }
                  error={errors[idx]?.endDate}
                />
              </FormField>
            </div>

            <div className="mt-3">
              <FormCheckbox
                label="I currently work here"
                checked={exp.isCurrent}
                onChange={(e) => update(idx, "isCurrent", e.target.checked)}
              />
            </div>

            <div className="mt-4">
              <FormField
                label="Description"
                htmlFor={`description-${idx}`}
                hint="Briefly describe your responsibilities and achievements."
              >
                <FormTextarea
                  id={`description-${idx}`}
                  rows={3}
                  placeholder="e.g. Full stack developer specializing in Next.js…"
                  value={exp.description ?? ""}
                  onChange={(e) => update(idx, "description", e.target.value)}
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      <FormDivider />

      <FormButton
        variant="secondary"
        onClick={addEntry}
        className="justify-center w-full"
      >
        <LuPlus size={15} />
        Add Another Experience
      </FormButton>
    </ModalPortal>
  );
};

export default ExperienceForm;
