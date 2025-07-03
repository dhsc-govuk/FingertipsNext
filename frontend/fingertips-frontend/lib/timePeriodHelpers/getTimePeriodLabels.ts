import { format } from 'date-fns';

export const Frequency = {
  Annual: 'Annual',
  Monthly: 'Monthly',
  Quarterly: 'Quarterly',
  CumulativeQuarters: 'CumulativeQuarters',
} as const;
export type Frequency = (typeof Frequency)[keyof typeof Frequency];

export const PeriodType = {
  Calendar: 'Calendar',
  Academic: 'Academic',
  Yearly: 'Yearly',
  Financial: 'Financial',
  FinancialYearEndPoint: 'FinancialYearEndPoint',
  FinancialMultiYear: 'FinancialMultiYear',
} as const;
export type PeriodType = (typeof PeriodType)[keyof typeof PeriodType];

export type ReportingPeriod = 1 | 3 | 5;

export interface DatePeriod {
  type: PeriodType;
  from: Date;
  to: Date;
}

type TimePeriodLabels = {
  periodLabelText: string;
  datePointLabel: string;
};

// Helper for academic year label, e.g. 2022/23
function getAcademicYear(date: Date) {
  const year = date.getFullYear();
  const endYearShort = (year + 1).toString().slice(-2);
  return `${year}/${endYearShort}`;
}

// Helper for financial year label, e.g. 2022/23 (starts April)
function getFinancialYear(date: Date) {
  const year = date.getFullYear();
  const endYearShort = (year + 1).toString().slice(-2);
  return `${year}/${endYearShort}`;
}

// Add years to a date, returns a new Date
function addYears(date: Date, years: number) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

// Get previous month (0-based), wrapping around to December if January
function getPreviousMonth(month: number) {
  return (month + 11) % 12;
}

// Get month name from 0-based month index
function getMonthName(month: number) {
  return format(new Date(2000, month, 1), 'MMM');
}

export const getTimePeriodLabels = (
  datePeriod: DatePeriod,
  collectionFrequency: Frequency,
  reportingPeriod: ReportingPeriod
): TimePeriodLabels => {
  // Sliding window for reportingPeriod > 1
  const slidingWindow = reportingPeriod - 1;

  // periodLabelText mapping (as before)
  if (
    datePeriod.type === PeriodType.Academic &&
    collectionFrequency === Frequency.Annual
  ) {
    if (reportingPeriod === 1) {
      return {
        periodLabelText: 'Academic year',
        datePointLabel: getAcademicYear(datePeriod.from),
      };
    } else {
      // e.g. 2023/24 to 2025/26
      const fromLabel = getAcademicYear(datePeriod.from);
      const toLabel = getAcademicYear(addYears(datePeriod.from, slidingWindow));
      return {
        periodLabelText: 'Academic year',
        datePointLabel: `${fromLabel} to ${toLabel}`,
      };
    }
  }
  if (
    datePeriod.type === PeriodType.Yearly &&
    collectionFrequency === Frequency.Annual
  ) {
    if (reportingPeriod === 1) {
      const fromYear = datePeriod.from.getFullYear();
      const toYearShort = datePeriod.to.getFullYear().toString().slice(-2);
      return {
        periodLabelText: 'Yearly (month to month e.g. November to October)',
        datePointLabel: `${fromYear}/${toYearShort}`,
      };
    } else {
      // e.g. 2023/24 to 2025/26
      const fromYear = datePeriod.from.getFullYear();
      const fromShort = (datePeriod.from.getFullYear() + 1)
        .toString()
        .slice(-2);
      const toYear = datePeriod.from.getFullYear() + slidingWindow;
      const toShort = (toYear + 1).toString().slice(-2);
      return {
        periodLabelText: 'Yearly (month to month e.g. November to October)',
        datePointLabel: `${fromYear}/${fromShort} to ${toYear}/${toShort}`,
      };
    }
  }
  if (
    datePeriod.type === PeriodType.Financial &&
    collectionFrequency === Frequency.Annual
  ) {
    if (reportingPeriod === 1) {
      return {
        periodLabelText: 'Financial year',
        datePointLabel: getFinancialYear(datePeriod.from),
      };
    } else {
      // e.g. 2023/24 to 2025/26
      const fromLabel = getFinancialYear(datePeriod.from);
      const toLabel = getFinancialYear(
        addYears(datePeriod.from, slidingWindow)
      );
      return {
        periodLabelText: 'Financial year',
        datePointLabel: `${fromLabel} to ${toLabel}`,
      };
    }
  }
  if (
    datePeriod.type === PeriodType.Financial &&
    collectionFrequency === Frequency.Monthly
  ) {
    if (reportingPeriod === 1) {
      return {
        periodLabelText: 'Monthly',
        datePointLabel: format(datePeriod.from, 'MMM yyyy'),
      };
    } else {
      // e.g. Aug 2022 to Jul 2024
      const fromLabel = format(datePeriod.from, 'MMM yyyy');
      const toDate = addYears(datePeriod.from, slidingWindow);
      const toMonth = getPreviousMonth(datePeriod.from.getMonth());
      const toYear =
        toMonth === 11 ? toDate.getFullYear() - 1 : toDate.getFullYear();
      const toLabel = `${getMonthName(toMonth)} ${toYear}`;
      return {
        periodLabelText: 'Monthly',
        datePointLabel: `${fromLabel} to ${toLabel}`,
      };
    }
  }
  if (
    datePeriod.type === PeriodType.FinancialYearEndPoint &&
    collectionFrequency === Frequency.Annual
  ) {
    const fromDate = new Date(datePeriod.from);
    fromDate.setFullYear(fromDate.getFullYear() - 1);

    const dayMonth = format(datePeriod.to, 'dd MMM');

    if (reportingPeriod === 1) {
      return {
        periodLabelText: 'Financial year end point',
        datePointLabel: `${dayMonth} ${getFinancialYear(fromDate)}`,
      };
    } else {
      const fromLabel = `${dayMonth} ${getFinancialYear(fromDate)}`;
      const toDate = addYears(fromDate, slidingWindow);
      const toLabel = `${dayMonth} ${getFinancialYear(toDate)}`;
      return {
        periodLabelText: 'Financial year end point',
        datePointLabel: `${fromLabel} to ${toLabel}`,
      };
    }
  }
  if (
    datePeriod.type === PeriodType.FinancialYearEndPoint &&
    collectionFrequency === Frequency.Quarterly
  ) {
    if (reportingPeriod === 1) {
      // e.g. Apr to Jun 2022
      const fromMonth = format(datePeriod.from, 'MMM');
      const toMonth = format(datePeriod.to, 'MMM');
      const year = datePeriod.from.getFullYear();
      return {
        periodLabelText: 'Financial year, Quarterly',
        datePointLabel: `${fromMonth} to ${toMonth} ${year}`,
      };
    } else {
      // e.g. Apr 2022 to Mar 2024
      const fromLabel = `${format(datePeriod.from, 'MMM yyyy')}`;
      const toDate = addYears(datePeriod.from, slidingWindow);
      // The "to" month is one before the "from" month, and year may need to be adjusted
      const toMonthIdx = getPreviousMonth(datePeriod.from.getMonth());
      const toYear =
        toMonthIdx === 11 ? toDate.getFullYear() - 1 : toDate.getFullYear();
      const toLabel = `${getMonthName(toMonthIdx)} ${toYear}`;
      return {
        periodLabelText: 'Financial year, Quarterly',
        datePointLabel: `${fromLabel} to ${toLabel}`,
      };
    }
  }
  if (
    datePeriod.type === PeriodType.FinancialMultiYear &&
    collectionFrequency === Frequency.CumulativeQuarters
  ) {
    if (reportingPeriod === 1) {
      const fromMonthYear = format(datePeriod.from, 'MMM yyyy');
      const toMonthYear = format(datePeriod.to, 'MMM yyyy');
      return {
        periodLabelText: 'Financial multi-year, cumulative quarters',
        datePointLabel: `${fromMonthYear} to ${toMonthYear}`,
      };
    } else {
      // Not mapped in tests, return empty string
      return {
        periodLabelText: 'Financial multi-year, cumulative quarters',
        datePointLabel: '',
      };
    }
  }
  if (
    datePeriod.type === PeriodType.Calendar &&
    collectionFrequency === Frequency.Quarterly
  ) {
    if (reportingPeriod === 1) {
      // e.g. Jan - Mar 2023
      const fromMonth = format(datePeriod.from, 'MMM');
      const toMonth = format(datePeriod.to, 'MMM');
      const year = datePeriod.from.getFullYear();
      return {
        periodLabelText: 'Quarterly',
        datePointLabel: `${fromMonth} - ${toMonth} ${year}`,
      };
    } else {
      // e.g. Jan 2023 - Dec 2025
      const fromLabel = format(datePeriod.from, 'MMM yyyy');
      const fromMonthIdx = datePeriod.from.getMonth();
      const fromYear = datePeriod.from.getFullYear();
      const toMonthIdx = (fromMonthIdx + 11) % 12; // previous month
      const toYear = fromYear + reportingPeriod - 1;
      const toLabel = `${getMonthName(toMonthIdx)} ${toYear}`;
      return {
        periodLabelText: 'Quarterly',
        datePointLabel: `${fromLabel} - ${toLabel}`,
      };
    }
  }
  if (
    datePeriod.type === PeriodType.Calendar &&
    collectionFrequency === Frequency.Annual
  ) {
    if (reportingPeriod === 1) {
      return {
        periodLabelText: '',
        datePointLabel: datePeriod.from.getFullYear().toString(),
      };
    } else {
      // e.g. 2023 to 2025
      const fromYear = datePeriod.from.getFullYear();
      const toYear = datePeriod.from.getFullYear() + slidingWindow;
      return {
        periodLabelText: '',
        datePointLabel: `${fromYear} to ${toYear}`,
      };
    }
  }
  // If no mapping found, return fallback
  return { periodLabelText: '', datePointLabel: 'X' };
};
