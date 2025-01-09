import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import {
  generateSeriesData,
  sortHealthDataByDate,
} from '@/lib/chartHelpers/formatLineChartValues';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

interface LineChartProps {
  data: HealthDataForArea[];
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function LineChart({
  data,
  title,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<LineChartProps>) {
  const orderedSeriesValues = sortHealthDataByDate(data);
  const seriesData = generateSeriesData(orderedSeriesValues);

  const lineChartOptions: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: title },
    xAxis: {
      title: { text: xAxisTitle },
    },
    yAxis: {
      title: { text: yAxisTitle },
    },
    legend: {
      verticalAlign: 'top',
    },
    series: seriesData,
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
