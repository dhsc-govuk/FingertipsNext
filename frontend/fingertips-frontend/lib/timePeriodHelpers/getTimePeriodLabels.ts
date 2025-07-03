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

function getRollingYears(date: Date) {
  const year = date.getFullYear();
  const endYearShort = (year + 1).toString().slice(-2);
  return `${year}/${endYearShort}`;
}

function addYears(date: Date, years: number) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

// Get previous month (0-based), wrapping around to December if January
function getPreviousMonth(month: number) {
  return (month + 11) % 12;
}

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

  if (
    datePeriod.type === PeriodType.Academic &&
    collectionFrequency === Frequency.Annual
  ) {
    if (reportingPeriod === 1) {
      return {
        periodLabelText: 'Academic year',
        datePointLabel: getRollingYears(datePeriod.from),
      };
    } else {
      const fromLabel = getRollingYears(datePeriod.from);
      const toLabel = getRollingYears(addYears(datePeriod.from, slidingWindow));
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
        datePointLabel: getRollingYears(datePeriod.from),
      };
    } else {
      const fromLabel = getRollingYears(datePeriod.from);
      const toLabel = getRollingYears(addYears(datePeriod.from, slidingWindow));
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
        datePointLabel: `${dayMonth} ${getRollingYears(fromDate)}`,
      };
    } else {
      const fromLabel = `${dayMonth} ${getRollingYears(fromDate)}`;
      const toDate = addYears(fromDate, slidingWindow);
      const toLabel = `${dayMonth} ${getRollingYears(toDate)}`;
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
      const fromMonth = format(datePeriod.from, 'MMM');
      const toMonth = format(datePeriod.to, 'MMM');
      const year = datePeriod.from.getFullYear();
      return {
        periodLabelText: 'Financial year, Quarterly',
        datePointLabel: `${fromMonth} to ${toMonth} ${year}`,
      };
    } else {
      const fromLabel = `${format(datePeriod.from, 'MMM yyyy')}`;
      const toDate = addYears(datePeriod.from, slidingWindow);
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
      const fromMonth = format(datePeriod.from, 'MMM');
      const toMonth = format(datePeriod.to, 'MMM');
      const year = datePeriod.from.getFullYear();
      return {
        periodLabelText: 'Quarterly',
        datePointLabel: `${fromMonth} - ${toMonth} ${year}`,
      };
    } else {
      const fromLabel = format(datePeriod.from, 'MMM yyyy');
      const fromYear = datePeriod.from.getFullYear();
      const toMonthIdx = getPreviousMonth(datePeriod.from.getMonth());
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
