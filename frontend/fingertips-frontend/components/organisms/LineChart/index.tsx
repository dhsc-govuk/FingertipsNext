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
    title: undefined,
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
      formatter: function () {
        return `
        <b>${this.series.name}</b>
        <br/>Year: ${this.x}<br/>
        <br/><span style="color:${this.color}">●</span> Value ${this.y}
      `;
      },
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
