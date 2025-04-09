import { AxisLabelsFormatterContextObject } from 'highcharts';
import { formatWholeNumber } from '@/lib/numberFormatter';

export function FormatValueAsWholeNumber(
  this: AxisLabelsFormatterContextObject,
  _ctx: AxisLabelsFormatterContextObject
): string {
  return formatWholeNumber(this.value as number);
}

export function FormatValueAsWholeNumberAbsolute(
  this: AxisLabelsFormatterContextObject,
  _ctx: AxisLabelsFormatterContextObject
): string {
  return formatWholeNumber(Math.abs(this.value as number));
}
