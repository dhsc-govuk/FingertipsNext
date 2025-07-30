import { Frequency, ReportingPeriod } from '@/generated-sources/ft-api-client';
import { reportingPeriodLabelOrder } from './segmentValues';

export const isSmallestReportingPeriod = (
  selectedReportingPeriod: string | undefined,
  reportingPeriodOptions: string[],
  frequency: Frequency
): boolean => {
  const period = (
    selectedReportingPeriod ??
    reportingPeriodOptions[0] ??
    ''
  ).toLowerCase();

  // Direct match with frequency
  if (period === frequency.toLowerCase()) return true;

  // Match with mapped labels
  const yearlyLabel =
    reportingPeriodLabelOrder[ReportingPeriod.Yearly]?.label.toLowerCase();
  const cumulativeQuarterlyLabel =
    reportingPeriodLabelOrder[
      ReportingPeriod.CumulativeQuarterly
    ]?.label.toLowerCase();

  if (period === yearlyLabel && frequency === Frequency.Annually) return true;
  if (period === cumulativeQuarterlyLabel && frequency === Frequency.Quarterly)
    return true;

  return false;
};
