'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import {
  generateSeriesData,
  sortHealthDataByDate,
} from '@/lib/chartHelpers/formatLineChartValues';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

interface LineChartProps {
  data: HealthDataForArea[];
  xAxisTitle?: string;
  accessibilityLabel?: string;
}
export function LineChart({
  data,
  xAxisTitle,
  accessibilityLabel,
}: Readonly<LineChartProps>) {
  const sortedSeriesValues = sortHealthDataByDate(data);
  const seriesData = generateSeriesData(sortedSeriesValues);

  const lineChartOptions: Highcharts.Options = {
    chart: { type: 'line', height: '50%', spacingTop: 50 },
    title: {
      text: 'See how the indicator has changed over time for the area',
      style: {
        display: 'none',
      },
    },
    yAxis: {
      title: undefined,
    },
    xAxis: {
      title: { text: xAxisTitle, margin: 20 },
      tickLength: 0,
    },
    legend: {
      verticalAlign: 'top',
    },
    series: seriesData,
    tooltip: {
      format:
        '<b>{point.series.name}</b><br/>Year: {point.x}<br/><br/><span style="color:{color}">\u25CF</span> Value {point.y}',
    },

    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
  };

  return (
    <div data-testid="lineChart-component">
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component' }}
        highcharts={Highcharts}
        options={lineChartOptions}
      />
    </div>
  );
}
