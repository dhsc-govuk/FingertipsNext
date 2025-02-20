export function IsWithinOneMonth(
  currentDate: Date,
  indicatorDate: Date
): boolean {
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return oneMonthAgo <= indicatorDate;
}
