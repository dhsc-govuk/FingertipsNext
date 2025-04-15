export function isWithinOneMonth(
  currentDate: Date,
  indicatorDate: Date
): boolean {
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return oneMonthAgo <= indicatorDate;
}

export function formatDate(date: Date | undefined): string {
  if (!date) return 'unknown';
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Converts a year to a GDS compliant string for non-calendar years such as financial years.
 * Use this where you are working with indicator data that has an annual period type that is not
 * calendar years.
 *
 * @param year - the year as a number e.g. 2024.
 * @returns the formatted non-calendar year e.g. 2024 to 2025.
 */
export function convertYearToNonCalendarYearLabel(year: number): string {
  return `${year} to ${year + 1}`;
}
