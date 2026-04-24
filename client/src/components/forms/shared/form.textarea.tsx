import { FormTextareaProps } from "@/types/props/forms.props.types";
import { forwardRef } from "react";

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className = "", error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        {...props}
        className={`bg-glass-bg-subtle focus:bg-glass-bg disabled:opacity-50 focus:shadow-focus-ring backdrop-blur-glass-blur-light px-4 py-2.5 border focus:border-glass-border-accent rounded-md outline-none w-full text-text-primary placeholder:text-text-muted text-sm transition-all duration-150 resize-none disabled:cursor-not-allowed ${error ? "border-status-error-border" : "border-border-default"} ${className}`}
      />
    </div>
  ),
);

export default FormTextarea;
