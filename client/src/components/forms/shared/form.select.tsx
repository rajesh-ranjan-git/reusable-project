import { forwardRef, useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { FormSelectProps } from "@/types/props/forms.props.types";

const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(
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
              ${error ? "border-status-error-border" : "border-border-default"}
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
            className={`absolute z-(--z-dropdown) w-full mt-2 backdrop-blur-md border border-border-default overflow-hidden transition-all duration-300 origin-top rounded-md
              ${
                isOpen
                  ? "opacity-100 scale-y-100 translate-y-0"
                  : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
              }`}
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
      </div>
    );
  },
);

export default FormSelect;
