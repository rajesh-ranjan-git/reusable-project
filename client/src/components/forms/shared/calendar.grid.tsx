import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { DAYS_SHORT, MONTHS } from "@/constants/common.constants";
import { CalendarGridProps } from "@/types/props/forms.props.types";
import { getDaysInMonth, getFirstDayOfMonth } from "@/utils/date.utils";

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
        {DAYS_SHORT.map((d) => (
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

export default CalendarGrid;
