import { ChangeEvent, forwardRef } from "react";
import { FormInputProps } from "@/types/props/forms.props.types";

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className = "",
      startIcon,
      endIcon,
      error,
      numericOnly,
      maxDigits,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (numericOnly) {
        value = value.replace(/\D/g, "");

        if (maxDigits) {
          value = value.slice(0, maxDigits);
        }

        e.currentTarget.value = value;
      }

      props.onChange?.(e);
    };

    return (
      <div className="relative w-full">
        {startIcon && (
          <div
            className={`top-1/2 left-4 absolute -translate-y-1/2 ${error ? "text-status-error-text" : "text-text-secondary"}`}
          >
            {startIcon}
          </div>
        )}

        <input
          ref={ref}
          {...props}
          onChange={handleChange}
          className={`bg-glass-bg-subtle focus:bg-glass-bg disabled:opacity-50 focus:shadow-focus-ring focus:border-glass-border-accent backdrop-blur-glass-blur-light px-4 py-2.5 border rounded-md outline-none w-full text-text-primary placeholder:text-text-muted text-sm transition-all duration-150 disabled:cursor-not-allowed ${startIcon ? "pl-10" : ""} ${endIcon ? "pr-10" : ""} ${error ? "border-status-error-border" : ""} ${className}`}
        />

        {endIcon && (
          <div
            className={`top-1/2 right-4 absolute -translate-y-1/2 ${error ? "text-status-error-text" : "text-text-secondary"}`}
          >
            {endIcon}
          </div>
        )}
      </div>
    );
  },
);

export default FormInput;
