import { FormLabelProps } from "@/types/props/forms.props.types";

const FormLabel = ({ htmlFor, children, required }: FormLabelProps) => (
  <label
    htmlFor={htmlFor}
    className="block my-1.5 ml-2 font-semibold text-text-secondary text-xs uppercase tracking-wider"
  >
    {children}
    {required && (
      <span className="ml-1 text-accent-purple" aria-hidden>
        *
      </span>
    )}
  </label>
);

export default FormLabel;
