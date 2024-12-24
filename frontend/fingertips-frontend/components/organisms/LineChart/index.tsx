import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

interface HealthCareData {
  areaCode: string;
  healthData: {
    year: number;
    count: number;
    value: number;
    lowerCi: number;
    upperCi: number;   
  }[];
}

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
  const value = data.map((item) => (item.healthData.map((point => point.value))));
  const categories = data.map((item => (item.healthData.map((point => point.year)))));

  console.log('categories', categories);

  const lineChartOptions: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: title },
    xAxis: {
      categories: categories.map((item => item.toString())),
      title: { text: xAxisTitle },
    },
    yAxis: {
      title: { text: yAxisTitle },
    },
    series: [
      {
        type: 'line',
        name: yAxisTitle,
        data: value,
      },
      {
        type: 'line',
        name: yAxisTitle,
        data: value,
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
