import { isSmallestReportingPeriod } from './isSmallestReportingPeriod';
import { Frequency, ReportingPeriod } from '@/generated-sources/ft-api-client';
import { reportingPeriodLabelOrder } from './segmentValues';

describe('isSmallestReportingPeriod', () => {
  it('returns true when selectedReportingPeriod matches frequency', () => {
    expect(
      isSmallestReportingPeriod('Monthly', ['Monthly'], Frequency.Monthly)
    ).toBe(true);
    expect(
      isSmallestReportingPeriod('Quarterly', ['Quarterly'], Frequency.Quarterly)
    ).toBe(true);
    expect(
      isSmallestReportingPeriod('Yearly', ['Yearly'], Frequency.Annually)
    ).toBe(true);
  });

  it('returns true when selectedReportingPeriod is undefined and first option matches frequency', () => {
    expect(
      isSmallestReportingPeriod(undefined, ['Monthly'], Frequency.Monthly)
    ).toBe(true);
    expect(
      isSmallestReportingPeriod(undefined, ['Quarterly'], Frequency.Quarterly)
    ).toBe(true);
    expect(
      isSmallestReportingPeriod(undefined, ['Yearly'], Frequency.Annually)
    ).toBe(true);
  });

  it('returns true for "Yearly" label and Annually frequency', () => {
    const yearlyLabel =
      reportingPeriodLabelOrder[ReportingPeriod.Yearly]?.label;
    expect(
      isSmallestReportingPeriod(
        yearlyLabel,
        [yearlyLabel ?? 'Yearly'],
        Frequency.Annually
      )
    ).toBe(true);
  });

  it('returns true for "Cumulative quarterly" label and Quarterly frequency', () => {
    const cumulativeLabel =
      reportingPeriodLabelOrder[ReportingPeriod.CumulativeQuarterly]?.label;
    expect(
      isSmallestReportingPeriod(
        cumulativeLabel,
        [cumulativeLabel ?? 'Cumulative quarterly'],
        Frequency.Quarterly
      )
    ).toBe(true);
  });

  it('returns false when selectedReportingPeriod does not match frequency', () => {
    expect(
      isSmallestReportingPeriod('Yearly', ['Yearly'], Frequency.Monthly)
    ).toBe(false);
    expect(
      isSmallestReportingPeriod('Monthly', ['Monthly'], Frequency.Quarterly)
    ).toBe(false);
    expect(
      isSmallestReportingPeriod('Quarterly', ['Quarterly'], Frequency.Annually)
    ).toBe(false);
  });

  it('returns false when reportingPeriodOptions is empty and selectedReportingPeriod is undefined', () => {
    expect(isSmallestReportingPeriod(undefined, [], Frequency.Monthly)).toBe(
      false
    );
  });
});
