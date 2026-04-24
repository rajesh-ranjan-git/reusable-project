import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LuChevronDown } from "react-icons/lu";

const data = [
  { name: "Jan", activeUsers: 4000, newMatches: 2400 },
  { name: "Feb", activeUsers: 1995, newMatches: 3100 },
  { name: "Mar", activeUsers: 6800, newMatches: 4200 },
  { name: "Apr", activeUsers: 8400, newMatches: 6100 },
  { name: "May", activeUsers: 9200, newMatches: 7800 },
  { name: "Jun", activeUsers: 11000, newMatches: 9400 },
];

const ChartCard = () => {
  const [isTimelineDropdownOpen, setIsTimelineDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsTimelineDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col lg:col-span-2 p-6 glass">
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-start sm:items-center w-full">
          <div className="w-full">
            <h4>Platform Engagement</h4>
          </div>

          <div className="relative mb-4 min-w-38" ref={dropdownRef}>
            <label className="sr-only">Timeline</label>
            <button
              type="button"
              onClick={() => setIsTimelineDropdownOpen(!isTimelineDropdownOpen)}
              className={`w-full flex items-center justify-between gap-2 text-left font-poppins text-sm px-3 py-2.5 rounded-md border transition-all duration-200 backdrop-blur-md outline-none
                ${
                  isTimelineDropdownOpen
                    ? "border-accent-purple shadow-focus bg-glass-bg-hover"
                    : "hover:bg-glass-bg-strong hover:border-glass-border-accent"
                }
                ${selectedRole ? "text-text-on-glass" : "text-text-muted"}
              `}
            >
              {selectedRole || "Timeline"}

              <div
                className={`transition-transform  duration-300 ${
                  isTimelineDropdownOpen
                    ? "rotate-180 text-accent-purple"
                    : "text-text-secondary"
                }`}
              >
                <LuChevronDown size={16} className="shrink-0" />
              </div>
            </button>

            <div
              className={`absolute z-(--z-dropdown) w-full mt-2 backdrop-blur-md border border-glass-border overflow-hidden transition-all duration-300 origin-top
                ${
                  isTimelineDropdownOpen
                    ? "opacity-100 scale-y-100 translate-y-0"
                    : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                }`}
              style={{ borderRadius: "var(--border-radius-md)" }}
            >
              <ul className="flex flex-col m-0 py-2 max-h-60 overflow-y-auto list-none">
                {["Last 6 Months", "This Year", "All Time"].map((role) => (
                  <li key={role}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        setSelectedRole(role);
                        setIsTimelineDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 bg-transparent border-none text-[0.9375rem] transition-all hover:bg-glass-bg-hover hover:text-accent-purple
                          ${
                            selectedRole === role
                              ? "text-accent-purple bg-status-info-bg"
                              : "text-text-on-glass"
                          }
                        `}
                    >
                      {role}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <p className="text-text-secondary text-sm">
            Active users vs New matches over 6 months
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-75">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0F1A",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#E5E7EB",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              cursor={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Line
              type="monotone"
              dataKey="activeUsers"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ fill: "#4F46E5", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
              name="Active Users"
            />
            <Line
              type="monotone"
              dataKey="newMatches"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: "#8B5CF6", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#8B5CF6" }}
              name="New Matches"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
