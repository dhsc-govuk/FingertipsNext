import {
  DatePeriod,
  Frequency,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import { format } from 'date-fns';

type TimePeriodLabels = {
  periodLabel: string;
  datePointLabel: string;
  timeRangeLabel: string;
};

function formatYear(date: Date) {
  return format(date, 'yyyy');
}

function addYears(date: Date, years: number) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

function getShortMonthLabel(date: Date) {
  const monthShort = format(date, 'MMM');
  return monthShort
}

function getRollingYearLabel(date: Date) {
  const year = date.getFullYear();

  const endYearShort = (year + 1).toString().slice(-2);
  return `${year}/${endYearShort}`;
}

function getFinancialMonthLabel(date: Date) {
  return `${getShortMonthLabel(date)} ${formatYear(date)}`
}

export const getTimePeriodLabels = (
  datePeriod: DatePeriod,
  collectionFrequency: Frequency,
  reportingPeriod: 1 | 3 | 5
): TimePeriodLabels => {
  // Calculate the "to" date by adding periodDimension to the "from" date's year
  const toDate = addYears(datePeriod.from, reportingPeriod);

  if (datePeriod.type === PeriodType.Calendar) {
    return {
      periodLabel: 'Calendar year',
      datePointLabel: formatYear(datePeriod.from),
      timeRangeLabel: `${formatYear(datePeriod.from)} - ${formatYear(toDate)}`,
    };
  }

  if (datePeriod.type === PeriodType.Academic) {
    return {
      periodLabel: 'Academic year',
      datePointLabel: getRollingYearLabel(datePeriod.from),
      timeRangeLabel: `${getRollingYearLabel(datePeriod.from)} - ${getRollingYearLabel(toDate)}`,
    };
  }

  if (datePeriod.type === PeriodType.Financial) {
    if (collectionFrequency === Frequency.Monthly) {
      return {
        periodLabel: 'Monthly',
        datePointLabel: getFinancialMonthLabel(datePeriod.from),
        timeRangeLabel: `${getFinancialMonthLabel(datePeriod.from)} - ${getFinancialMonthLabel(toDate)}`,
      };
    }

    return {
      periodLabel: 'Financial year',
      datePointLabel: getRollingYearLabel(datePeriod.from),
      timeRangeLabel: `${getRollingYearLabel(datePeriod.from)} - ${getRollingYearLabel(toDate)}`,
    };
  }

  return {
    periodLabel: 'X',
    datePointLabel: 'X',
    timeRangeLabel: 'X',
  };
};
