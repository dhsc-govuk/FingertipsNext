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
  data: HealthCareData[];
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function BarChart({
  data,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<ChartProps>) {
  const barChartOptions: Highcharts.Options = {
    chart: { type: 'bar', height: '100%', spacingTop: 50 },
    xAxis: {
      categories: data.map((item) => item.areaCode),
    },
    yAxis: {
      title: { text: yAxisTitle, margin: 20 },
      plotLines: [
        {
          color: 'black',
          width: 2,
          value: 750,
          zIndex: 5,
          label: {
            text: 'England',
            align: 'center',
            verticalAlign: 'top',
            rotation: 0,
            y: -10,
            style: {
              color: 'black',
              fontWeight: 'bold',
            },
          },
        },
      ],
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
        pointPadding: 0.1,
        groupPadding: 0.1,
      },
    },
    series: data.map((item) => ({
      name: 'Value',
      type: 'bar',
      data: item.healthData.map((point) => point.value),
    })),
    legend: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
  };

  return (
    <div data-testid="barChart-component">
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component' }}
        highcharts={Highcharts}
        options={barChartOptions}
      />
    </div>
  );
}
