import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthCareData } from '@/app/chart/health-data';

interface LineChartProps {
  data: HealthCareData[];
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
  const years = data.map((item) => item.healthData.map((point) => point.year));
  const formatYear = years.flat().map((year) => year.toString());

  const lineChartOptions: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: title },
    xAxis: {
      categories: Array.from(new Set(formatYear)),
      title: { text: xAxisTitle },
    },
    yAxis: {
      title: { text: yAxisTitle },
    },
    series: data.map((item) => ({
      type: 'line',
      name: `AreaCode ${item.areaCode}`,
      data: item.healthData.map((point) => point.value),
    })),
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
