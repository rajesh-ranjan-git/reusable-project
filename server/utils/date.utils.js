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

export const getRemainingTime = (dateString) => {
  if (!dateString) return "NA";

  const timeLeft = Math.ceil((dateString - Date.now()) / 60000);

  const hoursLeft = Math.trunc(timeLeft / 60);

  const minutesLeft = hoursLeft > 0 ? timeLeft - hoursLeft * 60 : timeLeft;

  return hoursLeft > 0
    ? `${hoursLeft} hrs ${minutesLeft} mins`
    : `${minutesLeft} mins`;
};
