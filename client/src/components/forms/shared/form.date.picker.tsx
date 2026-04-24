import { useEffect, useRef, useState } from "react";
import { LuCalendar, LuX } from "react-icons/lu";
import { FormDatePickerProps } from "@/types/props/forms.props.types";
import { formatDate, isSameDay } from "@/utils/date.utils";
import CalendarGrid from "@/components/forms/shared/calendar.grid";

const FormDatePicker = ({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  error,
  disabled = false,
  minDate,
  maxDate,
  className = "",
}: FormDatePickerProps) => {
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
    </div>
  );
};

export default FormDatePicker;
