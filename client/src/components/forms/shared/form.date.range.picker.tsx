import { useEffect, useRef, useState } from "react";
import { LuCalendar, LuX } from "react-icons/lu";
import { FormDateRangePickerProps } from "@/types/props/forms.props.types";
import { formatDate, isSameDay } from "@/utils/date.utils";
import CalendarGrid from "@/components/forms/shared/calendar.grid";

const FormDateRangePicker = ({
  value,
  onChange,
  placeholder = "Pick a date range",
  error,
  disabled = false,
  minDate,
  maxDate,
  className = "",
}: FormDateRangePickerProps) => {
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
    </div>
  );
};

export default FormDateRangePicker;
