import { AxisLabelsFormatterContextObject } from 'highcharts';
import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';

export function FormatValueAsNumber(
  this: AxisLabelsFormatterContextObject,
  _ctx: AxisLabelsFormatterContextObject
): string {
  return formatNumber(this.value as number);
}

export function FormatValueAsNumberAbsolute(
  this: AxisLabelsFormatterContextObject,
  _ctx: AxisLabelsFormatterContextObject
): string {
  return formatNumber(Math.abs(this.value as number));
}

export function FormatValueAsWholeNumberAbsolute(
  this: AxisLabelsFormatterContextObject,
  _ctx: AxisLabelsFormatterContextObject
): string {
  return formatWholeNumber(Math.abs(this.value as number));
}

// Proper docs if doing this please
export function FormatYearAsFinancialYear(
  this: AxisLabelsFormatterContextObject,
  _ctx: AxisLabelsFormatterContextObject
): string {
  if (typeof this.value !== 'number') {
    throw new Error(
      'Improper usage: year when provided for chart plots must be a number'
    );
  }

  return `${this.value} to ${this.value + 1}`;
}
