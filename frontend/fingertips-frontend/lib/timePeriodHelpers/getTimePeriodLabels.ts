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
// If before 1st September, the academic year is previous year / current year.
// If on/after 1st September, it's current year / next year.
function getAcademicYear(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based, so September is 8
  if (month >= 8) {
    // September or later
    const endYearShort = (year + 1).toString().slice(-2);
    return `${year}/${endYearShort}`;
  } else {
    // Before September
    const startYear = year - 1;
    const endYearShort = year.toString().slice(-2);
    return `${startYear}/${endYearShort}`;
  }
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
    if (datePeriod.frequency === Frequency.Annual) {
      return {
        periodLabel: 'Calendar year',
        datePointLabel: formatYear(datePeriod.from),
        timeRangeLabel: `${formatYear(datePeriod.from)} - ${formatYear(datePeriod.to)}`,
      };
    }
  }

  return {
    periodLabel: 'X',
    datePointLabel: 'X',
    timeRangeLabel: 'X',
  };
};
