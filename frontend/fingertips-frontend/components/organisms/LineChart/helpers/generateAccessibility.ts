import { lineChartDefaultOptions } from './generateStandardLineChartOptions';

export function generateAccessibility(
  accessibilityLabel?: string
): Highcharts.AccessibilityOptions {
  return {
    ...lineChartDefaultOptions.accessibility,
    description: accessibilityLabel,
  };
}
