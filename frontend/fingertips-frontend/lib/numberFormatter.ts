const FormattingLocale = 'en-GB';
const NumberOfDecimalPlaces = 1;

const numberFormat = new Intl.NumberFormat(FormattingLocale, {
  minimumFractionDigits: NumberOfDecimalPlaces,
  maximumFractionDigits: NumberOfDecimalPlaces,
  roundingMode: 'halfCeil',
});

export function formatNumber(value: number | undefined): string {
  return value !== undefined ? numberFormat.format(value) : 'X';
}

const wholeNumberFormat = new Intl.NumberFormat(FormattingLocale, {
  maximumFractionDigits: 0,
  roundingMode: 'halfCeil',
});

export function formatWholeNumber(value: number | undefined): string {
  return value !== undefined ? wholeNumberFormat.format(value) : 'X';
}
