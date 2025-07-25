import { DatePeriod } from '@/generated-sources/ft-api-client';

export function determineUniquePeriods(items: DatePeriod[]): DatePeriod[] {
  return Array.from(
    new Map(items.map((item) => [JSON.stringify(item), item])).values()
  );
}
