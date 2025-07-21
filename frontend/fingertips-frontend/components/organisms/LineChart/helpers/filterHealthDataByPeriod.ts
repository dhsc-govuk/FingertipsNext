import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

export function filterHealthDataByPeriod<
  T extends { healthData: { datePeriod?: { from?: Date } }[] },
>(
  data: T | undefined,
  firstDateAsNumber: number | undefined,
  lastDateAsNumber: number | undefined
): T | undefined {
  if (!data || !data.healthData || !firstDateAsNumber || !lastDateAsNumber)
    return data;
  return {
    ...data,
    healthData: data.healthData.filter((point) => {
      const dateNum = convertDateToNumber(point.datePeriod?.from);
      return dateNum >= firstDateAsNumber && dateNum <= lastDateAsNumber;
    }),
  };
}
