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
import {
  LuCalendar,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuX,
} from "react-icons/lu";
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
    className="block mb-1.5 ml-2 font-semibold text-text-secondary text-xs uppercase tracking-wider"
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
        <div
          className={`top-1/2 left-4 absolute -translate-y-1/2 ${error ? "text-status-error-text" : "text-text-secondary"}`}
        >
          {startIcon}
        </div>
      )}

      <input
        ref={ref}
        {...props}
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
        className={`bg-glass-bg-subtle focus:bg-glass-bg disabled:opacity-50 focus:shadow-focus-ring backdrop-blur-glass-blur-light px-4 py-2.5 border focus:border-glass-border-accent rounded-md outline-none w-full text-text-primary placeholder:text-text-muted text-sm transition-all duration-150 resize-none disabled:cursor-not-allowed ${error ? "border-status-error-border" : "border-border-default"} ${className}`}
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

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
};
export const FormCheckbox = ({
  label,
  className = "",
  checked,
  onChange,
  disabled,
  error,
  ...props
}: CheckboxProps) => (
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

type RadioOption = {
  label: string;
  value: string;
  hint?: string;
};

type RadioGroupProps = {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  layout?: "vertical" | "horizontal";
};

export const FormRadioGroup = ({
  name,
  options,
  value,
  onChange,
  disabled,
  error,
  layout = "vertical",
}: RadioGroupProps) => (
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

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(d: Date) {
  return `${d.getDate().toString().padStart(2, "0")} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

type CalendarGridProps = {
  viewYear: number;
  viewMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  renderDay: (date: Date, dayNum: number) => ReactNode;
};

const CalendarGrid = ({
  viewYear,
  viewMonth,
  onPrevMonth,
  onNextMonth,
  renderDay,
}: CalendarGridProps) => {
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="backdrop-blur-md p-4 w-full min-w-72 select-none glass">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={onPrevMonth}
          className="p-1 btn btn-ghost"
          aria-label="Previous month"
        >
          <LuChevronLeft size={18} />
        </button>
        <span className="font-semibold text-text-primary text-sm">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="p-1 btn btn-ghost"
          aria-label="Next month"
        >
          <LuChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-1 font-semibold text-[10px] text-text-muted text-center uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="gap-y-0.5 grid grid-cols-7">
        {cells.map((dayNum, idx) => (
          <div key={idx} className="flex justify-center items-center">
            {dayNum !== null ? (
              renderDay(new Date(viewYear, viewMonth, dayNum), dayNum)
            ) : (
              <span className="w-8 h-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

type DatePickerProps = {
  id: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
};

export const FormDatePicker = ({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  error,
  disabled = false,
  minDate,
  maxDate,
  className = "",
}: DatePickerProps) => {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(
    value ? value.getMonth() : today.getMonth(),
  );
  const [viewYear, setViewYear] = useState(
    value ? value.getFullYear() : today.getFullYear(),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isDisabledDay = (date: Date) => {
    if (
      minDate &&
      date <
        new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    )
      return true;
    if (
      maxDate &&
      date >
        new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
    )
      return true;
    return false;
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 text-left text-sm px-4 py-2.5 rounded-md border transition-all duration-200 backdrop-blur-glass-blur-light outline-none bg-glass-bg-subtle hover:bg-glass-bg
          ${isOpen ? "border-accent-purple shadow-focus-ring shadow-lg" : "border-glass-border-accent"}
          ${error ? "border-status-error-border" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span className={value ? "text-text-primary" : "text-text-muted"}>
          {value ? formatDate(value) : placeholder}
        </span>
        <span
          className={`flex items-center gap-1.5 transition-colors ${isOpen ? "text-accent-purple" : "text-text-secondary"}`}
        >
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  onChange?.(null);
                }
              }}
              className="hover:bg-status-error-bg border border-transparent hover:border-status-error-border rounded-full hover:text-status-error-text transition-all ease-in-out"
              aria-label="Clear date"
            >
              <LuX size={16} />
            </span>
          )}
          <LuCalendar size={16} />
        </span>
      </button>

      <div
        id={id}
        className={`absolute z-(--z-dropdown) mt-2 w-full transition-all duration-250 origin-top
          ${isOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"}`}
      >
        <CalendarGrid
          viewYear={viewYear}
          viewMonth={viewMonth}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          renderDay={(date, dayNum) => {
            const isSelected = value ? isSameDay(date, value) : false;
            const isToday = isSameDay(date, today);
            const isDisabled = isDisabledDay(date);

            return (
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  onChange?.(date);
                  setIsOpen(false);
                }}
                className={`flex justify-center items-center rounded-full w-8 h-8 p-0 font-medium text-sm transition-all duration-150 ${isDisabled ? "text-text-muted opacity-40 cursor-not-allowed" : "cursor-pointer"} ${isSelected ? "text-white shadow-md bg-(image:--gradient-brand-vivid)" : isToday ? "text-accent-purple font-bold border border-accent-purple bg-glass-bg-subtle" : "text-text-on-glass hover:bg-glass-bg-hover hover:text-accent-purple"}`}
                aria-label={date.toDateString()}
                aria-pressed={isSelected}
              >
                {dayNum}
              </button>
            );
          }}
        />
      </div>

      <FormErrorMessage error={error ? error : null} />
    </div>
  );
};

export type DateRange = { start: Date | null; end: Date | null };

type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
};

export const FormDateRangePicker = ({
  value,
  onChange,
  placeholder = "Pick a date range",
  error,
  disabled = false,
  minDate,
  maxDate,
  className = "",
}: DateRangePickerProps) => {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  const [viewMonth2, viewYear2] = (() => {
    if (viewMonth === 11) return [0, viewYear + 1];
    return [viewMonth + 1, viewYear];
  })();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSelecting("start");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isDisabledDay = (date: Date) => {
    if (
      minDate &&
      date <
        new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    )
      return true;
    if (
      maxDate &&
      date >
        new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
    )
      return true;
    return false;
  };

  const handleDayClick = (date: Date) => {
    if (isDisabledDay(date)) return;

    if (selecting === "start") {
      onChange?.({ start: date, end: null });
      setSelecting("end");
    } else {
      const start = value?.start ?? date;
      if (date < start) {
        onChange?.({ start: date, end: start });
      } else {
        onChange?.({ start, end: date });
      }
      setSelecting("start");
      setIsOpen(false);
    }
  };

  const isInRange = (date: Date) => {
    const start = value?.start;
    const end = value?.end ?? (selecting === "end" && hovered ? hovered : null);
    if (!start || !end) return false;
    const lo = start <= end ? start : end;
    const hi = start <= end ? end : start;
    return date > lo && date < hi;
  };

  const isRangeStart = (date: Date) =>
    !!value?.start && isSameDay(date, value.start);
  const isRangeEnd = (date: Date) => !!value?.end && isSameDay(date, value.end);

  const displayValue = () => {
    if (!value?.start && !value?.end) return null;
    if (value.start && !value.end) return `${formatDate(value.start)} → …`;
    if (value.start && value.end)
      return `${formatDate(value.start)} → ${formatDate(value.end)}`;
    return null;
  };

  const renderRangeDay = (date: Date, dayNum: number) => {
    const selected = isRangeStart(date) || isRangeEnd(date);
    const inRange = isInRange(date);
    const isToday = isSameDay(date, today);
    const isDisabled = isDisabledDay(date);
    const isStart = isRangeStart(date);
    const isEnd = isRangeEnd(date);

    return (
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => handleDayClick(date)}
        onMouseEnter={() => setHovered(date)}
        onMouseLeave={() => setHovered(null)}
        className={`relative w-8 h-8 flex items-center justify-center text-sm font-medium transition-all duration-100
          ${isDisabled ? "text-text-muted opacity-40 cursor-not-allowed" : "cursor-pointer"}
          ${selected ? "text-white z-10" : ""}
          ${inRange ? "text-accent-purple" : ""}
          ${!selected && !inRange && !isToday && !isDisabled ? "text-text-on-glass hover:text-accent-purple" : ""}
          ${isToday && !selected ? "font-bold text-accent-purple" : ""}
        `}
        aria-label={date.toDateString()}
      >
        {inRange && (
          <span className="z-0 absolute inset-x-0 inset-y-0.5 bg-[rgba(139,92,246,0.1)]" />
        )}

        {isStart && value?.end && (
          <span className="right-0 left-1/2 z-0 absolute inset-y-0.5 bg-[rgba(139,92,246,0.1)]" />
        )}

        {isEnd && value?.start && (
          <span className="right-1/2 left-0 z-0 absolute inset-y-0.5 bg-[rgba(139,92,246,0.1)]" />
        )}

        {selected && (
          <span className="z-0 absolute inset-0 shadow rounded-full bg-(image:--gradient-brand-vivid)" />
        )}

        {isToday && !selected && (
          <span className="z-0 absolute inset-0 opacity-60 border border-accent-purple rounded-full" />
        )}
        <span className="z-10 relative">{dayNum}</span>
      </button>
    );
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setIsOpen((o) => !o);
          if (!isOpen) setSelecting("start");
        }}
        className={`w-full flex items-center justify-between gap-2 text-left text-sm px-4 py-2.5 rounded-md border transition-all duration-200 backdrop-blur-glass-blur-light outline-none
          bg-glass-bg-subtle hover:bg-glass-bg
          ${isOpen ? "border-glass-border-accent shadow-focus-ring" : "border-border-default"}
          ${error ? "border-status-error-border" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span
          className={displayValue() ? "text-text-primary" : "text-text-muted"}
        >
          {displayValue() ?? placeholder}
        </span>
        <span
          className={`flex items-center gap-1.5 transition-colors ${isOpen ? "text-accent-purple" : "text-text-secondary"}`}
        >
          {(value?.start || value?.end) && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange?.({ start: null, end: null });
                setSelecting("start");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  onChange?.({ start: null, end: null });
                  setSelecting("start");
                }
              }}
              className="hover:text-status-error-text transition-colors"
              aria-label="Clear range"
            >
              <LuX size={14} />
            </span>
          )}
          <LuCalendar size={15} />
        </span>
      </button>

      <div
        className={`absolute left-0 z-(--z-dropdown) mt-2 transition-all duration-250 origin-top
          ${isOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"}`}
      >
        <div className="flex items-center gap-2 bg-glass-bg backdrop-blur-md mb-2 px-3 py-1.5 border border-border-default rounded-lg w-fit text-text-secondary text-xs">
          <span
            className={`rounded-full w-2 h-2 shrink-0 ${selecting === "start" ? "bg-(image:--gradient-brand-vivid)" : "bg-[rgba(139,92,246,0.25)]"}`}
          />
          {selecting === "start" ? "Pick a start date" : "Pick an end date"}
        </div>

        <div className="flex gap-2">
          <CalendarGrid
            viewYear={viewYear}
            viewMonth={viewMonth}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            renderDay={renderRangeDay}
          />

          <CalendarGrid
            viewYear={viewYear2}
            viewMonth={viewMonth2}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            renderDay={renderRangeDay}
          />
        </div>
      </div>

      <FormErrorMessage error={error ? error : null} />
    </div>
  );
};

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
      {loading ? <TbLoader3 size={18} /> : null}
      {children}
    </button>
  );
};
