export function return_eligible_date(placedAt) {
  const placedDate = new Date(placedAt);
  // Add 7 days to the placed date
  placedDate.setDate(placedDate.getDate() + 7);
  return placedDate;
}
