import { TbLoader3 } from "react-icons/tb";
import { FormButtonProps } from "@/types/props/forms.props.types";

const FormButton = ({
  variant = "secondary",
  size = "md",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: FormButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none";

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-5 py-2.5 text-sm rounded-md",
  };

  const variants = {
    primary: "btn btn-primary hover:opacity-90 active:scale-[0.98]",
    secondary: "btn btn-secondary glass active:scale-[0.98]",
    ghost: "btn btn-ghost active:scale-[0.98]",
    danger: "alert alert-error active:scale-[0.98]",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? <TbLoader3 size={18} className="animate-spin" /> : null}
      {children}
    </button>
  );
};

export default FormButton;
