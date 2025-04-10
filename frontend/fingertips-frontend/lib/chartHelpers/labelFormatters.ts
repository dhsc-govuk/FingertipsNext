import { AxisLabelsFormatterContextObject } from 'highcharts';
import { formatNumber } from '@/lib/numberFormatter';

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
