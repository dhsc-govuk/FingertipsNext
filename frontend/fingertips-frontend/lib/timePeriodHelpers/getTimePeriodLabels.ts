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

function getPreviousMonth(month: number) {
  return (month + 11) % 12;
}

function getMonthName(month: number) {
  return format(new Date(2000, month, 1), 'MMM');
}

// --- Label formatters ---

const labelFormatters: {
  [key: string]: {
    periodLabelText: string;
    datePointLabel: (
      datePeriod: DatePeriod,
      reportingPeriod: ReportingPeriod
    ) => string;
  };
} = {
  // Calendar + Annual
  [`${PeriodType.Calendar}_${Frequency.Annual}`]: {
    periodLabelText: '',
    datePointLabel: (datePeriod, reportingPeriod) => {
      if (reportingPeriod === 1) {
        return datePeriod.from.getFullYear().toString();
      }
      const fromYear = datePeriod.from.getFullYear();
      const toYear = fromYear + reportingPeriod - 1;
      return `${fromYear} to ${toYear}`;
    },
  },
  // Calendar + Quarterly
  [`${PeriodType.Calendar}_${Frequency.Quarterly}`]: {
    periodLabelText: 'Quarterly',
    datePointLabel: (datePeriod, reportingPeriod) => {
      if (reportingPeriod === 1) {
        const fromMonth = format(datePeriod.from, 'MMM');
        const toMonth = format(datePeriod.to, 'MMM');
        const year = datePeriod.from.getFullYear();
        return `${fromMonth} - ${toMonth} ${year}`;
      }
      const fromLabel = format(datePeriod.from, 'MMM yyyy');
      const fromYear = datePeriod.from.getFullYear();
      const toMonthIdx = getPreviousMonth(datePeriod.from.getMonth());
      const toYear = fromYear + reportingPeriod - 1;
      const toLabel = `${getMonthName(toMonthIdx)} ${toYear}`;
      return `${fromLabel} - ${toLabel}`;
    },
  },
  // Calendar + Monthly
  [`${PeriodType.Calendar}_${Frequency.Monthly}`]: {
    periodLabelText: 'Monthly',
    datePointLabel: (datePeriod, reportingPeriod) => {
      if (reportingPeriod === 1) {
        return format(datePeriod.from, 'MMM yyyy');
      }
      const fromLabel = format(datePeriod.from, 'MMM yyyy');
      const toDate = addYears(datePeriod.from, reportingPeriod - 1);
      const toMonth = getPreviousMonth(datePeriod.from.getMonth());
      const toYear =
        toMonth === 11 ? toDate.getFullYear() - 1 : toDate.getFullYear();
      const toLabel = `${getMonthName(toMonth)} ${toYear}`;
      return `${fromLabel} to ${toLabel}`;
    },
  },
  // Academic + Annual
  [`${PeriodType.Academic}_${Frequency.Annual}`]: {
    periodLabelText: 'Academic year',
    datePointLabel: (datePeriod, reportingPeriod) => {
      if (reportingPeriod === 1) {
        return getRollingYears(datePeriod.from);
      }
      const fromLabel = getRollingYears(datePeriod.from);
      const toLabel = getRollingYears(
        addYears(datePeriod.from, reportingPeriod - 1)
      );
      return `${fromLabel} to ${toLabel}`;
    },
  },
  // Yearly + Annual
  [`${PeriodType.Yearly}_${Frequency.Annual}`]: {
    periodLabelText: 'Yearly (month to month e.g. November to October)',
    datePointLabel: (datePeriod, reportingPeriod) => {
      if (reportingPeriod === 1) {
        const fromYear = datePeriod.from.getFullYear();
        const toYearShort = datePeriod.to.getFullYear().toString().slice(-2);
        return `${fromYear}/${toYearShort}`;
      }
      const fromYear = datePeriod.from.getFullYear();
      const fromShort = (datePeriod.from.getFullYear() + 1)
        .toString()
        .slice(-2);
      const toYear = datePeriod.from.getFullYear() + reportingPeriod - 1;
      const toShort = (toYear + 1).toString().slice(-2);
      return `${fromYear}/${fromShort} to ${toYear}/${toShort}`;
    },
  },
  // Financial + Annual
  [`${PeriodType.Financial}_${Frequency.Annual}`]: {
    periodLabelText: 'Financial year',
    datePointLabel: (datePeriod, reportingPeriod) => {
      if (reportingPeriod === 1) {
        return getRollingYears(datePeriod.from);
      }
      const fromLabel = getRollingYears(datePeriod.from);
      const toLabel = getRollingYears(
        addYears(datePeriod.from, reportingPeriod - 1)
      );
      return `${fromLabel} to ${toLabel}`;
    },
  },
  // FinancialYearEndPoint + Quarterly
  [`${PeriodType.Financial}_${Frequency.Quarterly}`]: {
    periodLabelText: 'Financial year, Quarterly',
    datePointLabel: (datePeriod, reportingPeriod) => {
      if (reportingPeriod === 1) {
        const fromMonth = format(datePeriod.from, 'MMM');
        const toMonth = format(datePeriod.to, 'MMM');
        const year = datePeriod.from.getFullYear();
        return `${fromMonth} to ${toMonth} ${year}`;
      }
      // e.g. Apr 2022 to Mar 2024
      const fromLabel = `${format(datePeriod.from, 'MMM yyyy')}`;
      const toDate = addYears(datePeriod.from, reportingPeriod - 1);
      const toMonthIdx = getPreviousMonth(datePeriod.from.getMonth());
      const toYear =
        toMonthIdx === 11 ? toDate.getFullYear() - 1 : toDate.getFullYear();
      const toLabel = `${getMonthName(toMonthIdx)} ${toYear}`;
      return `${fromLabel} to ${toLabel}`;
    },
  },
  // Financial + Monthly
  [`${PeriodType.Financial}_${Frequency.Monthly}`]: {
    periodLabelText: 'Monthly',
    datePointLabel: (datePeriod, reportingPeriod) => {
      if (reportingPeriod === 1) {
        return format(datePeriod.from, 'MMM yyyy');
      }
      const fromLabel = format(datePeriod.from, 'MMM yyyy');
      const toDate = addYears(datePeriod.from, reportingPeriod - 1);
      const toMonth = getPreviousMonth(datePeriod.from.getMonth());
      const toYear =
        toMonth === 11 ? toDate.getFullYear() - 1 : toDate.getFullYear();
      const toLabel = `${getMonthName(toMonth)} ${toYear}`;
      return `${fromLabel} to ${toLabel}`;
    },
  },
  // FinancialYearEndPoint + Annual
  [`${PeriodType.FinancialYearEndPoint}_${Frequency.Annual}`]: {
    periodLabelText: 'Financial year end point',
    datePointLabel: (datePeriod, reportingPeriod) => {
      const fromDate = new Date(datePeriod.from);
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      const dayMonth = format(datePeriod.to, 'dd MMM');
      if (reportingPeriod === 1) {
        return `${dayMonth} ${getRollingYears(fromDate)}`;
      }
      const fromLabel = `${dayMonth} ${getRollingYears(fromDate)}`;
      const toDate = addYears(fromDate, reportingPeriod - 1);
      const toLabel = `${dayMonth} ${getRollingYears(toDate)}`;
      return `${fromLabel} to ${toLabel}`;
    },
  },
  // FinancialMultiYear + CumulativeQuarters
  [`${PeriodType.FinancialMultiYear}_${Frequency.CumulativeQuarters}`]: {
    periodLabelText: 'Financial multi-year, cumulative quarters',
    datePointLabel: (datePeriod, reportingPeriod) => {
      if (reportingPeriod === 1) {
        const fromMonthYear = format(datePeriod.from, 'MMM yyyy');
        const toMonthYear = format(datePeriod.to, 'MMM yyyy');
        return `${fromMonthYear} to ${toMonthYear}`;
      }
      return '';
    },
  },
};

export const getTimePeriodLabels = (
  datePeriod: DatePeriod,
  collectionFrequency: Frequency,
  reportingPeriod: ReportingPeriod
): TimePeriodLabels => {
  const key = `${datePeriod.type}_${collectionFrequency}`;
  const formatter = labelFormatters[key];
  if (formatter) {
    return {
      periodLabelText: formatter.periodLabelText,
      datePointLabel: formatter.datePointLabel(datePeriod, reportingPeriod),
    };
  }

  return { periodLabelText: '', datePointLabel: 'X' };
};
