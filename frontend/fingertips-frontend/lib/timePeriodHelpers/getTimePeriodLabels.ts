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
  const month = date.getMonth(); // 0-based, so September is 8
  if (month >= 8) {
    const endYearShort = (year + 1).toString().slice(-2);
    return `${year}/${endYearShort}`;
  } else {
    const startYear = year - 1;
    const endYearShort = year.toString().slice(-2);
    return `${startYear}/${endYearShort}`;
  }
}

// Helper for financial year label, e.g. 2022/23 (starts April)
function getFinancialYear(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based, so April is 3
  if (month >= 3) {
    const endYearShort = (year + 1).toString().slice(-2);
    return `${year}/${endYearShort}`;
  } else {
    const startYear = year - 1;
    const endYearShort = year.toString().slice(-2);
    return `${startYear}/${endYearShort}`;
  }
}

export const getTimePeriodLabels = (
  datePeriod: DatePeriod,
  collectionFrequency: Frequency,
  // reportingPeriod: ReportingPeriod
): TimePeriodLabels => {
  // periodLabelText mapping (as before)
  if (
    datePeriod.type === PeriodType.Academic &&
    collectionFrequency === Frequency.Annual
  ) {
    return {
      periodLabelText: 'Academic year',
      datePointLabel: getAcademicYear(datePeriod.from),
    };
  }
  if (
    datePeriod.type === PeriodType.Yearly &&
    collectionFrequency === Frequency.Annual
  ) {
    // e.g. 2023/24 for from: 2023-11-01, to: 2024-10-31
    const fromYear = datePeriod.from.getFullYear();
    const toYearShort = datePeriod.to.getFullYear().toString().slice(-2);
    return {
      periodLabelText: 'Yearly (month to month e.g. November to October)',
      datePointLabel: `${fromYear}/${toYearShort}`,
    };
  }
  if (
    datePeriod.type === PeriodType.Financial &&
    collectionFrequency === Frequency.Annual
  ) {
    return {
      periodLabelText: 'Financial year',
      datePointLabel: getFinancialYear(datePeriod.from),
    };
  }
  if (
    datePeriod.type === PeriodType.Financial &&
    collectionFrequency === Frequency.Monthly
  ) {
    // e.g. Aug 2022
    return {
      periodLabelText: 'Monthly',
      datePointLabel: format(datePeriod.from, 'MMM yyyy'),
    };
  }
  if (
    datePeriod.type === PeriodType.FinancialYearEndPoint &&
    collectionFrequency === Frequency.Annual
  ) {
    // e.g. 31 Mar 2022/23
    const dayMonth = format(datePeriod.to, 'dd MMM');
    return {
      periodLabelText: 'Financial year end point',
      datePointLabel: `${dayMonth} ${getFinancialYear(datePeriod.from)}`,
    };
  }
  if (
    datePeriod.type === PeriodType.FinancialYearEndPoint &&
    collectionFrequency === Frequency.Quarterly
  ) {
    // e.g. Apr to Jun 2022
    const fromMonth = format(datePeriod.from, 'MMM');
    const toMonth = format(datePeriod.to, 'MMM');
    const year = datePeriod.from.getFullYear();
    return {
      periodLabelText: 'Financial year, Quarterly',
      datePointLabel: `${fromMonth} to ${toMonth} ${year}`,
    };
  }
  if (
    datePeriod.type === PeriodType.FinancialMultiYear &&
    collectionFrequency === Frequency.CumulativeQuarters
  ) {
    // e.g. Apr 2022 to Sep 2023
    const fromMonthYear = format(datePeriod.from, 'MMM yyyy');
    const toMonthYear = format(datePeriod.to, 'MMM yyyy');
    return {
      periodLabelText: 'Financial multi-year, cumulative quarters',
      datePointLabel: `${fromMonthYear} to ${toMonthYear}`,
    };
  }
  if (
    datePeriod.type === PeriodType.Calendar &&
    collectionFrequency === Frequency.Quarterly
  ) {
    // e.g. Jan - Mar 2023
    const fromMonth = format(datePeriod.from, 'MMM');
    const toMonth = format(datePeriod.to, 'MMM');
    const year = datePeriod.from.getFullYear();
    return {
      periodLabelText: 'Quarterly',
      datePointLabel: `${fromMonth} - ${toMonth} ${year}`,
    };
  }
  if (
    datePeriod.type === PeriodType.Calendar &&
    collectionFrequency === Frequency.Annual
  ) {
    // e.g. 2023
    return {
      periodLabelText: '',
      datePointLabel: datePeriod.from.getFullYear().toString(),
    };
  }
  // If no mapping found, return fallback
  return { periodLabelText: '', datePointLabel: 'X' };
};
