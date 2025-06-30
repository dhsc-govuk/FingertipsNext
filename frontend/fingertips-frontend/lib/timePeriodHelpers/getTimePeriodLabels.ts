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

// Academic year starts on 1st September.
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

// Financial year starts on 1st April.
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

// For monthly financial periods, prefix with month short name
function getFinancialMonthLabel(date: Date) {
  const monthShort = format(date, 'MMM');
  return `${monthShort} ${getFinancialYear(date)}`;
}

export const getTimePeriodLabels = (
  datePeriod: DatePeriod
): TimePeriodLabels => {
  if (datePeriod.type === PeriodType.Calendar) {
    return {
      periodLabel: 'Calendar year',
      datePointLabel: formatYear(datePeriod.from),
      timeRangeLabel: `${formatYear(datePeriod.from)} - ${formatYear(datePeriod.to)}`,
    };
  }

  if (datePeriod.type === PeriodType.Academic) {
    return {
      periodLabel: 'Academic year',
      datePointLabel: getAcademicYear(datePeriod.from),
      timeRangeLabel: `${getAcademicYear(datePeriod.from)} - ${getAcademicYear(datePeriod.to)}`,
    };
  }

  if (datePeriod.type === PeriodType.Financial) {
    if (datePeriod.frequency === Frequency.Monthly) {
      return {
        periodLabel: 'Financial year, monthly',
        datePointLabel: getFinancialMonthLabel(datePeriod.from),
        timeRangeLabel: `${getFinancialMonthLabel(datePeriod.from)} - ${getFinancialMonthLabel(datePeriod.to)}`,
      };
    }
    return {
      periodLabel: 'Financial year',
      datePointLabel: getFinancialYear(datePeriod.from),
      timeRangeLabel: `${getFinancialYear(datePeriod.from)} - ${getFinancialYear(datePeriod.to)}`,
    };
  }

  return {
    periodLabel: 'X',
    datePointLabel: 'X',
    timeRangeLabel: 'X',
  };
};
