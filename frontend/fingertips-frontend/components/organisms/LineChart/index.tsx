import { WeatherForecast } from '@/generated-sources/api-client';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

interface LineChartProps {
  data: WeatherForecast[];
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
  const categories = data.map(
    (item) => item.date?.toLocaleDateString('en-GB') ?? ''
  );
  const temperatureData = data.map((item) => item.temperatureC ?? '');

  const lineChartOptions: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: title },
    xAxis: {
      categories: categories,
      title: { text: xAxisTitle },
    },
    yAxis: {
      title: { text: yAxisTitle },
    },
    series: [
      {
        type: 'line',
        name: yAxisTitle,
        data: temperatureData,
      },
    ],
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
