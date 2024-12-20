'use client';
import { WeatherForecast } from '@/generated-sources/api-client';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

interface ChartProps {
  type: Highcharts.ChartOptions['type'];
  data: WeatherForecast[];
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export function BarChart({
  data,
  type = 'bar',
  title = 'Weather Forecast',
  xAxisTitle = 'Date',
  yAxisTitle = 'Temperature (°C)',
}: Readonly<ChartProps>) {
  const categories = data.map(
    (item) => item.date?.toLocaleDateString('en-GB') ?? ''
  );
  const temperatureData = data.map((item) => item.temperatureC ?? '');

  const lineChartOptions: Highcharts.Options = {
    chart: { type: type },
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
        type: type,
        name: yAxisTitle,
        data: temperatureData,
      },
    ],
    accessibility: {
      enabled: true,
      description: `A ${type} chart showing temperature data over time.`,
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
