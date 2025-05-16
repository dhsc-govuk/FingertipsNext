import {
  getFormattedLabel,
  AXIS_TITLE_FONT_SIZE,
} from '@/lib/chartHelpers/chartHelpers';
import { lineChartDefaultOptions } from './generateStandardLineChartOptions';

export function generateYAxis(yAxisTitle?: string): Highcharts.YAxisOptions {
  return {
    ...lineChartDefaultOptions.yAxis,
    labels: {
      formatter: function () {
        return getFormattedLabel(Number(this.value), this.axis.tickPositions);
      },
      ...(lineChartDefaultOptions.yAxis as Highcharts.YAxisOptions)?.labels,
    },
    title: yAxisTitle
      ? {
          text: yAxisTitle,
          margin: 20,
          style: { fontSize: AXIS_TITLE_FONT_SIZE },
        }
      : undefined,
  };
}
