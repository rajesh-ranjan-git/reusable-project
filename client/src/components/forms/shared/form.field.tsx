import { FormFieldProps } from "@/types/props/forms.props.types";
import FormErrorMessage from "@/components/forms/shared/form.error";
import FormLabel from "@/components/forms/shared/form.label";

const FormField = ({
  label,
  htmlFor,
  required,
  error,
  children,
  hint,
  startIcon,
  endIcon,
}: FormFieldProps) => (
  <div className="w-full">
    {label && (
      <FormLabel htmlFor={htmlFor} required={required}>
        {label}
      </FormLabel>
    )}

    <div className="relative">
      {startIcon && (
        <div
          className={`top-1/2 left-4 absolute -translate-y-1/2 ${error ? "text-status-error-text" : "text-text-secondary"}`}
        >
          {startIcon}
        </div>
      )}

      <div className={`${startIcon ? "pl-10" : ""} ${endIcon ? "pr-10" : ""}`}>
        {children}
      </div>

      {endIcon && (
        <div
          className={`top-1/2 right-4 absolute -translate-y-1/2 ${error ? "text-status-error-text" : "text-text-secondary"}`}
        >
          {endIcon}
        </div>
      )}
    </div>

    {hint && !error && <p className="mt-1 text-text-muted text-xs">{hint}</p>}

    <FormErrorMessage error={error ? error : null} />
  </div>
);

export default FormField;
