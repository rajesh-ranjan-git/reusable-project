import { MONTHS } from "@/constants/common.constants";

export const getDateToShow = (dateString?: string | Date) => {
  if (!dateString) return "NA";

  return new Date(dateString)
    .toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase())
    .split(", ")
    .join(" ");
};

export const getDateToStore = (dateString?: string | Date) => {
  if (!dateString) return "NA";

  const dateStr = new Date(dateString);

  return `${dateStr.toISOString().split("T")[0]} ${dateStr.toLocaleTimeString()}`;
};

export const formatLocalDate = (date: Date | null) => {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export const isSameDay = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const formatDate = (date: string | Date) => {
  const incomingDate = new Date(date);

  return `${incomingDate.getDate().toString().padStart(2, "0")} ${MONTHS[incomingDate.getMonth()].slice(0, 3)} ${incomingDate.getFullYear()}`;
};

export const getDuration = (
  startDate: string,
  endDate: string | null,
): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);

  return parts.join(" ") || "< 1 mo";
};
