"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  InputHTMLAttributes,
  ReactNode,
  ButtonHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { LuChevronDown } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import FormErrorMessage from "@/components/forms/formErrorMessage";

type LabelProps = {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
};

export const FormLabel = ({ htmlFor, children, required }: LabelProps) => (
  <label
    htmlFor={htmlFor}
    className="block mb-1.5 font-semibold text-text-secondary text-xs uppercase tracking-wider"
  >
    {children}
    {required && (
      <span className="ml-1 text-accent-purple" aria-hidden>
        *
      </span>
    )}
  </label>
);

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  error?: string;
};

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", startIcon, endIcon, error, ...props }, ref) => (
    <div className="relative w-full">
      {startIcon && (
        <div className="top-1/2 left-4 absolute text-text-secondary -translate-y-1/2">
          {startIcon}
        </div>
      )}

      <input
        ref={ref}
        {...props}
        className={`bg-glass-bg-subtle focus:bg-glass-bg disabled:opacity-50 focus:shadow-focus-ring focus:border-glass-border-accent backdrop-blur-glass-blur-light px-4 py-2.5 border rounded-md outline-none w-full text-text-primary placeholder:text-text-muted text-sm transition-all duration-150 disabled:cursor-not-allowed ${startIcon ? "pl-10" : ""} ${endIcon ? "pr-10" : ""} ${error ? "border-status-error-border" : ""} ${className}`}
      />

      {endIcon && (
        <div className="top-1/2 right-4 absolute text-text-secondary -translate-y-1/2">
          {endIcon}
        </div>
      )}
    </div>
  ),
);
FormInput.displayName = "FormInput";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        {...props}
        className={`bg-glass-bg-subtle focus:bg-glass-bg disabled:opacity-50 focus:shadow-focus-ring backdrop-blur-glass-blur-light px-4 py-2.5 border focus:border-glass-border-accent rounded-md outline-none w-full text-text-primary placeholder:text-text-muted text-sm transition-all duration-150 resize-none disabled:cursor-not-allowed ${error ? "border-status-error-border" : "border-glass-border"} ${className}`}
      />

      <FormErrorMessage error={error ? error : null} />
    </div>
  ),
);
FormTextarea.displayName = "FormTextarea";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  options: Option[];
  id: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
};

export const FormSelect = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      id,
      value,
      onChange,
      placeholder = "Select",
      error,
      className = "",
      disabled = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className={`w-full ${className}`} ref={ref}>
        <div className="relative" ref={dropdownRef} id={id}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between gap-2 text-left font-poppins text-sm px-3 py-2.5 rounded-md border transition-all duration-200 backdrop-blur-md outline-none
              ${
                isOpen
                  ? "border-accent-purple shadow-focus bg-glass-bg-hover"
                  : "hover:bg-glass-bg-strong hover:border-glass-border-accent"
              }
              ${selectedOption ? "text-text-on-glass" : "text-text-muted"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${error ? "border-status-error-border" : "border-glass-border"}
            `}
          >
            {selectedOption?.label || placeholder}

            <div
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-180 text-accent-purple" : "text-text-secondary"
              }`}
            >
              <LuChevronDown size={16} />
            </div>
          </button>

          <div
            className={`absolute z-(--z-dropdown) w-full mt-2 backdrop-blur-md border border-glass-border overflow-hidden transition-all duration-300 origin-top
              ${
                isOpen
                  ? "opacity-100 scale-y-100 translate-y-0"
                  : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
              }`}
            style={{ borderRadius: "var(--border-radius-md)" }}
          >
            <ul className="flex flex-col m-0 py-2 max-h-60 overflow-y-auto list-none">
              {options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange?.(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[0.9375rem] transition-all hover:bg-glass-bg-hover hover:text-accent-purple
                      ${
                        value === opt.value
                          ? "text-accent-purple bg-status-info-bg"
                          : "text-text-on-glass"
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FormErrorMessage error={error ? error : null} />
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";

type FieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export const FormField = ({
  label,
  htmlFor,
  required,
  error,
  children,
  hint,
  startIcon,
  endIcon,
}: FieldProps) => (
  <div className="w-full">
    <FormLabel htmlFor={htmlFor} required={required}>
      {label}
    </FormLabel>

    <div className="relative">
      {startIcon && (
        <div className="top-1/2 left-4 absolute text-text-secondary -translate-y-1/2">
          {startIcon}
        </div>
      )}

      <div className={`${startIcon ? "pl-10" : ""} ${endIcon ? "pr-10" : ""}`}>
        {children}
      </div>

      {endIcon && (
        <div className="top-1/2 right-4 absolute text-text-secondary -translate-y-1/2">
          {endIcon}
        </div>
      )}
    </div>

    {hint && !error && <p className="mt-1 text-text-muted text-xs">{hint}</p>}

    <FormErrorMessage error={error ? error : null} />
  </div>
);

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const FormCheckbox = ({
  label,
  className = "",
  ...props
}: CheckboxProps) => (
  <label className="group flex items-center gap-2.5 w-fit cursor-pointer">
    <input
      type="checkbox"
      {...props}
      className={`w-4 h-4 accent-accent-purple cursor-pointer ${className}`}
    />
    <span className="text-text-secondary group-hover:text-text-primary text-sm transition-colors">
      {label}
    </span>
  </label>
);

export const FormDivider = ({ label }: { label?: string }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 bg-border-subtle h-px" />
    {label && (
      <span className="font-semibold text-[10px] text-text-muted uppercase tracking-widest">
        {label}
      </span>
    )}
    <div className="flex-1 bg-border-subtle h-px" />
  </div>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
};

export const FormButton = ({
  variant = "secondary",
  size = "md",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none";

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-5 py-2.5 text-sm rounded-md",
  };

  const variants = {
    primary: "btn btn-primary hover:opacity-90 active:scale-[0.98]",
    secondary: "btn btn-secondary active:scale-[0.98]",
    ghost: "btn btn-ghost active:scale-[0.98]",
    danger: "alert alert-error active:scale-[0.98]",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? <TbLoader3 size={18} /> : null}
      {children}
    </button>
  );
};
