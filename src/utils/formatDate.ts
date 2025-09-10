export default function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
