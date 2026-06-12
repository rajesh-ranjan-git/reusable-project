import { FormRadioGroupProps } from "@/types/props/forms.props.types";
import FormErrorMessage from "@/components/forms/shared/form.error";

export const FormRadioGroup = ({
  name,
  options,
  value,
  onChange,
  disabled,
  error,
  layout = "vertical",
}: FormRadioGroupProps) => (
  <div className="flex flex-col gap-1.5">
    <div
      className={`flex gap-3 ${layout === "vertical" ? "flex-col" : "flex-row flex-wrap"}`}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`group flex items-start gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onChange?.(opt.value)}
              className="sr-only"
            />
            <span
              className={`relative flex justify-center items-center mt-0.5 border-2 rounded-full w-5 h-5 transition-all duration-200 shrink-0 ${isSelected ? "border-accent-purple shadow-[0_0_0_3px_rgba(139,92,246,0.18)]" : "border-border-default group-hover:border-accent-purple bg-glass-bg-subtle"} ${error ? "border-status-error-border" : ""}`}
              aria-hidden
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 bg-(image:--gradient-brand-vivid) ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
              />
            </span>

            <span className="flex flex-col">
              <span
                className={`text-sm transition-colors duration-150 ${isSelected ? "text-text-primary font-medium" : "text-text-secondary group-hover:text-text-primary"}`}
              >
                {opt.label}
              </span>
              {opt.hint && (
                <span className="mt-0.5 text-text-muted text-xs">
                  {opt.hint}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>

    {error && <FormErrorMessage error={error} />}
  </div>
);
