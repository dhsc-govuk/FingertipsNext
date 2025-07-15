import {
  DatePeriod,
  Frequency,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import { format, addYears, subMonths, addQuarters, subDays } from 'date-fns';

/**
 * The following types are temporary.
 * Once the swagger has been updated then these types will come from the generated code.
 */
export type ReportingPeriod = 1 | 3 | 5;

type TimePeriodLabels = {
  periodLabelText: string;
  datePointLabel: string;
};

function getRollingYears(date: Date) {
  const year = date.getFullYear();
  const endYearShort = format(addYears(date, 1), 'yy');
  return `${year}/${endYearShort}`;
}

const labelFormatters: {
  [P in PeriodType]?: {
    [F in Frequency]?: {
      periodLabelText: string;
      datePointLabel: (
        datePeriod: DatePeriod,
        reportingPeriod: ReportingPeriod
      ) => string;
    };
  };
} = {
  [PeriodType.Calendar]: {
    [Frequency.Annually]: {
      periodLabelText: '',
      datePointLabel: (datePeriod, reportingPeriod) => {
        if (reportingPeriod === 1) {
          return datePeriod.from.getFullYear().toString();
        }
        const fromYear = datePeriod.from.getFullYear();
        const toYear = addYears(
          datePeriod.from,
          reportingPeriod - 1
        ).getFullYear();
        return `${fromYear} to ${toYear}`;
      },
    },
    [Frequency.Quarterly]: {
      periodLabelText: 'Quarterly',
      datePointLabel: (datePeriod, reportingPeriod) => {
        const toDate = subMonths(
          addYears(datePeriod.from, reportingPeriod - 1),
          1
        );

        if (reportingPeriod === 1) {
          const fromMonth = format(datePeriod.from, 'MMM');
          const toLabel = format(datePeriod.to, 'MMM yyyy');
          return `${fromMonth} - ${toLabel}`;
        }
        const fromLabel = format(datePeriod.from, 'MMM yyyy');
        const toLabel = format(toDate, 'MMM yyyy');
        return `${fromLabel} - ${toLabel}`;
      },
    },
    [Frequency.Monthly]: {
      periodLabelText: 'Monthly',
      datePointLabel: (datePeriod, reportingPeriod) => {
        const toDate = subMonths(
          addYears(datePeriod.from, reportingPeriod - 1),
          1
        );

        if (reportingPeriod === 1) {
          return format(datePeriod.from, 'MMM yyyy');
        }
        const fromLabel = format(datePeriod.from, 'MMM yyyy');
        const toLabel = format(toDate, 'MMM yyyy');
        return `${fromLabel} to ${toLabel}`;
      },
    },
  },
  [PeriodType.Academic]: {
    [Frequency.Annually]: {
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
  },
  [PeriodType.Yearly]: {
    [Frequency.Annually]: {
      periodLabelText: 'Yearly (month to month e.g. November to October)',
      datePointLabel: (datePeriod, reportingPeriod) => {
        if (reportingPeriod === 1) {
          const fromYear = datePeriod.from.getFullYear();
          const toYearShort = datePeriod.to.getFullYear().toString().slice(-2);
          return `${fromYear}/${toYearShort}`;
        }

        const toDate = addYears(datePeriod.from, reportingPeriod - 1);
        return `${getRollingYears(datePeriod.from)} to ${getRollingYears(toDate)}`;
      },
    },
  },
  [PeriodType.Financial]: {
    [Frequency.Annually]: {
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
    [Frequency.Quarterly]: {
      periodLabelText: 'Financial year, Quarterly',
      datePointLabel: (datePeriod, reportingPeriod) => {
        const toDate = subMonths(
          addYears(datePeriod.from, reportingPeriod - 1),
          1
        );

        if (reportingPeriod === 1) {
          const fromMonth = format(datePeriod.from, 'MMM');
          const toDateLabel = format(datePeriod.to, 'MMM yyyy');
          return `${fromMonth} to ${toDateLabel}`;
        }

        const fromLabel = `${format(datePeriod.from, 'MMM yyyy')}`;
        const toLabel = format(toDate, 'MMM yyyy');
        return `${fromLabel} to ${toLabel}`;
      },
    },
    [Frequency.Monthly]: {
      periodLabelText: 'Monthly',
      datePointLabel: (datePeriod, reportingPeriod) => {
        const toDate = subMonths(
          addYears(datePeriod.from, reportingPeriod - 1),
          1
        );

        if (reportingPeriod === 1) {
          return format(datePeriod.from, 'MMM yyyy');
        }

        const fromLabel = `${format(datePeriod.from, 'MMM yyyy')}`;
        const toLabel = format(toDate, 'MMM yyyy');
        return `${fromLabel} to ${toLabel}`;
      },
    },
  },
  [PeriodType.FinancialYearEndPoint]: {
    [Frequency.Annually]: {
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
  },
  [PeriodType.FinancialMultiYear]: {
    [Frequency.Quarterly]: {
      periodLabelText: 'Financial multi-year, cumulative quarters',
      datePointLabel: (datePeriod, reportingPeriod) => {
        if (reportingPeriod !== 1) return '';

        const fromMonthYear = format(datePeriod.from, 'MMM yyyy');
        const toMonthYear = format(datePeriod.to, 'MMM yyyy');
        return `${fromMonthYear} to ${toMonthYear}`;
      },
    },
  },
};

export const getTimePeriodLabels = (
  datePeriod: DatePeriod | undefined,
  collectionFrequency: Frequency,
  reportingPeriod: ReportingPeriod
): TimePeriodLabels => {
  if (!datePeriod) return { periodLabelText: '', datePointLabel: '' };

  const formatter = labelFormatters[datePeriod.type]?.[collectionFrequency];

  if (!formatter) return { periodLabelText: '', datePointLabel: 'X' };

  return {
    periodLabelText: formatter.periodLabelText,
    datePointLabel: formatter.datePointLabel(datePeriod, reportingPeriod),
  };
};

export const formatterXAxisLabel = (
  periodType: PeriodType,
  fromDate: number,
  collectionFrequency: Frequency,
  reportingPeriod: ReportingPeriod
): string => {
  const formatter = labelFormatters[periodType]?.[collectionFrequency];

  if (!formatter) return '';

  let toDate = new Date();
  if (collectionFrequency === Frequency.Quarterly) {
    toDate = addQuarters(new Date(fromDate), 1);
    toDate = subDays(toDate, 1);
  } else {
    toDate = addYears(new Date(fromDate), 1);
    toDate = subDays(toDate, 1);
  }

  const datePeriod: DatePeriod = {
    type: periodType,
    from: new Date(fromDate),
    to: new Date(toDate),
  };

  return formatter.datePointLabel(datePeriod, reportingPeriod);
};
export const getPeriodLabel = (
  periodType: PeriodType,
  collectionFrequency: Frequency
): string => {
  const formatter = labelFormatters[periodType]?.[collectionFrequency];

  if (!formatter) return '';

  return formatter.periodLabelText;
};
