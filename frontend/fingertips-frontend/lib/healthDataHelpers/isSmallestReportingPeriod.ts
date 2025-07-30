import { Frequency, ReportingPeriod } from '@/generated-sources/ft-api-client';
import { reportingPeriodLabelOrder } from './segmentValues';

export const isSmallestReportingPeriod = (
  selectedReportingPeriod: string | undefined,
  reportingPeriodOptions: string[],
  frequency: Frequency
): boolean => {
  const reportingPeriod =
    selectedReportingPeriod ??
    reportingPeriodOptions[0] ??
    ReportingPeriod.Yearly;

  const reportingPeriodFlag =
    reportingPeriod.toLowerCase() === frequency.toLowerCase() ||
    (reportingPeriod.toLowerCase() ===
      reportingPeriodLabelOrder[ReportingPeriod.Yearly]?.label.toLowerCase() &&
      frequency === Frequency.Annually) ||
    (reportingPeriod.toLowerCase() ===
      reportingPeriodLabelOrder[
        ReportingPeriod.CumulativeQuarterly
      ]?.label.toLowerCase() &&
      frequency === Frequency.Quarterly);

  return reportingPeriodFlag;
};
