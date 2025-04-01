const FormattingLocale = 'en-GB';
const NumberOfDecimalPlaces = 1;

const numberFormat = new Intl.NumberFormat(FormattingLocale, {
  maximumFractionDigits: NumberOfDecimalPlaces,
});

export function formatNumber(value?: number): string {
  return value !== undefined ? numberFormat.format(value) : 'X';
}

/*
  needs looking at
  ~~~~~~~~~~~~~~~~
  only 1 decimal place, so look at other values that I previously ignored

  To ask about
  ~~~~~~~~~~~~
  SparklineChart tooptip - just uses default tooltip
 */
