import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthCareData } from '@/app/chart/health-data';
import {
  formatYearsForXAxis,
  generateSeriesData,
} from '@/components/pages/chart/helper';

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
  const categoriesXAxis = formatYearsForXAxis(data);
  const seriesData = generateSeriesData(data);

  const lineChartOptions: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: title },
    xAxis: {
      categories: categoriesXAxis,
      title: { text: xAxisTitle },
    },
    yAxis: {
      title: { text: yAxisTitle },
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
