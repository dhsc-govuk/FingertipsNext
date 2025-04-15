import { AxisLabelsFormatterContextObject } from 'highcharts';
import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';
import { convertYearToNonCalendarYearLabel } from '../dateHelpers/dateHelpers';

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

export function FormatYearAsNonCalendarYear(
  this: AxisLabelsFormatterContextObject,
  _ctx: AxisLabelsFormatterContextObject
): string {
  if (typeof this.value === 'string') {
    return this.value;
  }

  // e.g. 2024 to 2025 rather than simply 2024
  return convertYearToNonCalendarYearLabel(this.value);
}
