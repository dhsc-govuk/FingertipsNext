import {
  DatePeriod,
  Frequency,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import {
  format,
  addYears,
  subMonths,
  addQuarters,
  subDays,
  addMonths,
} from 'date-fns';

/**
 * The following types are temporary.
 * Once the swagger has been updated then these types will come from the generated code.
 */
export type ReportingPeriod = 1 | 3 | 5;

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
      periodLabelText: 'Yearly',
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
        const dayMonth = format(datePeriod.from, 'dd MMM');

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

const calculateToDate = (fromDate: Date, frequency: Frequency): Date => {
  let toDate = new Date();
  if (frequency === Frequency.Quarterly) {
    toDate = addQuarters(fromDate, 1);
  } else if (frequency === Frequency.Monthly) {
    toDate = addMonths(fromDate, 1);
  } else {
    toDate = addYears(fromDate, 1);
  }

  return subDays(toDate, 1);
};

export const formatDatePointLabel = (
  periodType: PeriodType,
  fromDateAsNumber: number,
  frequency: Frequency,
  reportingPeriod: ReportingPeriod
): string => {
  const formatter = labelFormatters[periodType]?.[frequency];

  if (!formatter) return 'X';

  const fromDate = new Date(fromDateAsNumber);
  const toDate = calculateToDate(fromDate, frequency);

  const datePeriod: DatePeriod = {
    type: periodType,
    from: fromDate,
    to: toDate,
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

export const getAdditionalPeriodLabel = (
  periodType: PeriodType,
  fromDateAsNumber: number | undefined
): string => {
  if (periodType === PeriodType.Yearly && fromDateAsNumber) {
    const month = format(new Date(fromDateAsNumber), 'LLLL');

    return `(month to month e.g. ${month} to ${month}) `;
  }

  return '';
};

export const convertDateToNumber = (
  date: Date | string | undefined
): number => {
  return new Date(date ?? '').getTime();
};
