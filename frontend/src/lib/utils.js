export function formatDate(date) {
  return date.toLocaleDateString("en-In", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}