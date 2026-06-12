import { FormCheckboxProps } from "@/types/props/forms.props.types";
import FormErrorMessage from "@/components/forms/shared/form.error";

const FormCheckbox = ({
  label,
  className = "",
  checked,
  onChange,
  disabled,
  error,
  ...props
}: FormCheckboxProps) => (
  <div className="flex flex-col gap-1">
    <label
      className={`group flex items-center gap-3 w-fit ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />

      <span
        className={`relative flex justify-center items-center border-2 rounded-[6px] w-5 h-5 transition-all duration-200 shrink-0 ${checked ? "border-transparent bg-(image:--gradient-brand-vivid) shadow-[0_0_0_3px_rgba(139,92,246,0.18)]" : "border-border-default group-hover:border-accent-purple bg-glass-bg-subtle"} ${error ? "border-status-error-border" : ""} ${className}`}
        aria-hidden
      >
        <svg
          viewBox="0 0 14 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 h-2.5 transition-all duration-200 ${checked ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M1.5 5.5L5.5 9.5L12.5 1.5"
            stroke="white"
            strokeWidth="2.2"
          />
        </svg>
      </span>

      <span
        className={`text-sm transition-colors duration-150 ${checked ? "text-text-primary font-medium" : "text-text-secondary group-hover:text-text-primary"}`}
      >
        {label}
      </span>
    </label>

    {error && <FormErrorMessage error={error} />}
  </div>
);

export default FormCheckbox;
