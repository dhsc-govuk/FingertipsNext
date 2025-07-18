import { AXIS_TITLE_FONT_SIZE } from '@/lib/chartHelpers/chartHelpers';
import { lineChartDefaultOptions } from './generateStandardLineChartOptions';

export function generateXAxis(
  categories: string[],
  xAxisTitle?: string
): Highcharts.XAxisOptions {
  return {
    ...lineChartDefaultOptions.xAxis,
    title: {
      text: xAxisTitle,
      margin: 20,
      style: { fontSize: AXIS_TITLE_FONT_SIZE },
    },
    categories,
    labels: {
      ...(lineChartDefaultOptions.yAxis as Highcharts.XAxisOptions)?.labels,
    },
  };
}
