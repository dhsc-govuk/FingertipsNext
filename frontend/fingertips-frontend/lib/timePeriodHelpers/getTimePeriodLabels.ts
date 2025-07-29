import {
  DatePeriod,
  Frequency,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import { format, addYears, subYears } from 'date-fns';

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
        reportingPeriodFlag: boolean
      ) => string;
    };
  };
} = {
  [PeriodType.Calendar]: {
    [Frequency.Annually]: {
      periodLabelText: '',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        if (reportingPeriodFlag) {
          return format(datePeriod.from, 'yyyy');
        }
        const fromYear = format(datePeriod.from, 'yyyy');
        const toYear = format(datePeriod.to, 'yyyy');
        return `${fromYear} to ${toYear}`;
      },
    },
    [Frequency.Quarterly]: {
      periodLabelText: 'Quarterly',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        if (reportingPeriodFlag) {
          const fromMonth = format(datePeriod.from, 'MMM');
          const toLabel = format(datePeriod.to, 'MMM yyyy');
          return `${fromMonth} - ${toLabel}`;
        }
        const fromLabel = format(datePeriod.from, 'MMM yyyy');
        const toLabel = format(datePeriod.to, 'MMM yyyy');
        return `${fromLabel} - ${toLabel}`;
      },
    },
    [Frequency.Monthly]: {
      periodLabelText: 'Monthly',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        if (reportingPeriodFlag) {
          return format(datePeriod.from, 'MMM yyyy');
        }
        const fromLabel = format(datePeriod.from, 'MMM yyyy');
        const toLabel = format(datePeriod.to, 'MMM yyyy');
        return `${fromLabel} to ${toLabel}`;
      },
    },
  },
  [PeriodType.Academic]: {
    [Frequency.Annually]: {
      periodLabelText: 'Academic year',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        if (reportingPeriodFlag) {
          return getRollingYears(datePeriod.from);
        }
        const fromLabel = getRollingYears(datePeriod.from);
        const toLabel = getRollingYears(subYears(datePeriod.to, 1));
        return `${fromLabel} to ${toLabel}`;
      },
    },
  },
  [PeriodType.Yearly]: {
    [Frequency.Annually]: {
      periodLabelText: 'Yearly',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        if (reportingPeriodFlag) {
          const fromYear = format(datePeriod.from, 'yyyy');
          const toYearShort = format(datePeriod.to, 'yy');
          return `${fromYear}/${toYearShort}`;
        }

        return `${getRollingYears(datePeriod.from)} to ${getRollingYears(subYears(datePeriod.to, 1))}`;
      },
    },
  },
  [PeriodType.Financial]: {
    [Frequency.Annually]: {
      periodLabelText: 'Financial year',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        if (reportingPeriodFlag) {
          return getRollingYears(datePeriod.from);
        }
        const fromLabel = getRollingYears(datePeriod.from);
        const toLabel = getRollingYears(subYears(datePeriod.to, 1));
        return `${fromLabel} to ${toLabel}`;
      },
    },
    [Frequency.Quarterly]: {
      periodLabelText: 'Financial year, Quarterly',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        if (reportingPeriodFlag) {
          const fromMonth = format(datePeriod.from, 'MMM');
          const toDateLabel = format(datePeriod.to, 'MMM yyyy');
          return `${fromMonth} to ${toDateLabel}`;
        }

        const fromLabel = format(datePeriod.from, 'MMM yyyy');
        const toLabel = format(datePeriod.to, 'MMM yyyy');
        return `${fromLabel} to ${toLabel}`;
      },
    },
    [Frequency.Monthly]: {
      periodLabelText: 'Monthly',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        if (reportingPeriodFlag) {
          return format(datePeriod.from, 'MMM yyyy');
        }

        const fromLabel = format(datePeriod.from, 'MMM yyyy');
        const toLabel = format(datePeriod.to, 'MMM yyyy');
        return `${fromLabel} to ${toLabel}`;
      },
    },
  },
  [PeriodType.FinancialYearEndPoint]: {
    [Frequency.Annually]: {
      periodLabelText: 'Financial year end point',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        const fromDate = subYears(new Date(datePeriod.from), 1);
        const dayMonth = format(datePeriod.from, 'dd MMM');

        if (reportingPeriodFlag) {
          return `${dayMonth} ${getRollingYears(fromDate)}`;
        }

        const fromLabel = `${dayMonth} ${getRollingYears(fromDate)}`;
        const toLabel = `${dayMonth} ${getRollingYears(subYears(datePeriod.to, 1))}`;
        return `${fromLabel} to ${toLabel}`;
      },
    },
  },
  [PeriodType.FinancialMultiYear]: {
    [Frequency.Quarterly]: {
      periodLabelText: 'Financial multi-year, cumulative quarters',
      datePointLabel: (datePeriod, reportingPeriodFlag) => {
        if (!reportingPeriodFlag) return '';

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
  reportingPeriodFlag: boolean
): string => {
  if (!datePeriod) return 'X';

  const formatter = labelFormatters[datePeriod.type]?.[frequency];

  if (!formatter) return 'X';

  return formatter.datePointLabel(datePeriod, reportingPeriodFlag);
};

export const getPeriodLabel = (
  periodType: PeriodType,
  frequency: Frequency
): string => {
  const formatter = labelFormatters[periodType]?.[frequency];

  if (!formatter) return '';

  return formatter.periodLabelText;
};

export const getAdditionalPeriodLabel = (datePeriod: DatePeriod): string => {
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
