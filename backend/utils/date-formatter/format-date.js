export function format_date(isoDate) {
  const date = new Date(isoDate);

  // Format date as "October 20, 2024"
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
