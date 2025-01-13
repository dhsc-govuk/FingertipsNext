'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

interface ChartProps {
  data: HealthDataForArea[];
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function BarChart({
  data,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<ChartProps>) {
  const barChartOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: { type: 'bar', height: '100%', spacingTop: 50 },
    title: {
      text: 'Bar chart to show how the indicator has changed over time for the area',
      style: {
        display: 'none',
      },
    },
    xAxis: {
      categories: data.map((item) => item.areaCode),
      lineWidth: 0,
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
    tooltip: {
      format:
        '<b>{point.series.name}</b><br/><br/><span style="color:{color}">\u25CF</span> Value {point.y}',
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
      name: `${item.areaCode}`,
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
