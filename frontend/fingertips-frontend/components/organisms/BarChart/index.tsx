'use client';

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

interface ChartProps {
  data: HealthCareData [];
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function BarChart({
  data,
  title,
  xAxisTitle,
  yAxisTitle, accessibilityLabel,
}: Readonly<ChartProps>) {

  const years = data.flatMap((item) =>
    item.healthData.map((point) => point.year)
  );
  const orderYears = Array.from(new Set(years)).sort((a, b) => a - b);
  
  const lineChartOptions: Highcharts.Options = {
    chart: { type: 'bar' },
    title: { text: title },
    xAxis: {
      categories: orderYears.map((year) => year.toString()),
      title: { text: xAxisTitle },
    },
    yAxis: {
      title: { text: yAxisTitle },
    },
    series: data.map((item) => ({
    type: 'bar',
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
