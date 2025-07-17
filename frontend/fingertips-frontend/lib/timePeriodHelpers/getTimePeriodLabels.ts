import {
  DatePeriod,
  Frequency,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import {
  format,
  addYears,
  subMonths,
  subYears,
} from 'date-fns';

/**
 * The following types are temporary.
 * Once the swagger has been updated then these types will come from the generated code.
 */
export type ReportingPeriod = 1 | 3 | 5;

function getRollingYears(date: Date) {
  const year = format(date, 'yyyy');
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
          return format(datePeriod.from, 'yyyy');
        }
        const fromYear = format(datePeriod.from, 'yyyy');
        const toYear = format(addYears(
          datePeriod.from,
          reportingPeriod - 1
        ), 'yyyy');
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
          const fromYear = format(datePeriod.from, 'yyyy');;
          const toYearShort = format(datePeriod.to, 'yy');
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
        const fromDate = subYears(new Date(datePeriod.from), 1);
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

export const formatDatePointLabel = (
  datePeriod: DatePeriod | undefined,
  frequency: Frequency,
  reportingPeriod: ReportingPeriod
): string => {
  if (!datePeriod) return 'X';

  const formatter = labelFormatters[datePeriod.type]?.[frequency];

  if (!formatter) return 'X';

  return formatter.datePointLabel(datePeriod, reportingPeriod);
};

export const getPeriodLabel = (
  periodType: PeriodType,
  frequency: Frequency
): string => {
  const formatter = labelFormatters[periodType]?.[frequency];

  if (!formatter) return '';

  return formatter.periodLabelText;
};

export const getAdditionalPeriodLabel = (
  datePeriod: DatePeriod
): string => {
  if (datePeriod.type === PeriodType.Yearly) {
    const fromMonth = format(datePeriod.from, 'LLLL');
    const toMonth = format(datePeriod.to, 'LLLL');

    return `(month to month e.g. ${fromMonth} to ${toMonth}) `;
  }

  return '';
};

export const convertDateToNumber = (
  date: Date | string | undefined
): number => {
  return new Date(date ?? '').getTime();
};
