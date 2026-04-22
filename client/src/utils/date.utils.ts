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
