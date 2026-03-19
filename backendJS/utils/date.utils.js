export const getDateToShow = (dateString) => {
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

export const getDateToStore = (dateString) => {
  if (!dateString) return "NA";

  const dateStr = new Date(dateString);

  return `${dateStr.toISOString().split("T")[0]} ${dateStr.toLocaleTimeString()}`;
};
