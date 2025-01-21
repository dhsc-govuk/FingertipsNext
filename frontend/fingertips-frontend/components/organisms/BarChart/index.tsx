'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { H3 } from 'govuk-react';

interface BarChartProps {
  data: HealthDataForArea[];
  yAxisTitle?: string;
  accessibilityLabel?: string;
  benchmarkLabel?: string;
  benchmarkValue?: number;
}

export function BarChart({
  data,
  yAxisTitle,
  accessibilityLabel,
  benchmarkLabel,
  benchmarkValue,
}: Readonly<BarChartProps>) {
  const barChartOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: { type: 'bar', height: '50%', spacingTop: 20, spacingBottom: 50 },
    title: {
      text: 'Bar chart to show how the indicator has changed over time for the area',
      style: {
        display: 'none',
      },
    },
    xAxis: {
      categories: data.map((item) => item.areaName),
      lineWidth: 0,
    },
    yAxis: {
      title: { text: yAxisTitle, margin: 20 },
      plotLines: [
        {
          color: 'black',
          width: 2,
          value: benchmarkValue,
          zIndex: 5,
          label: {
            text: benchmarkLabel,
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
        '<b>{point.category}</b><br/><br/><span style="color:{color}">\u25CF</span> Value {point.y}',
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
        pointPadding: 0.3,
        groupPadding: 0,
      },
    },
    series: [
      {
        type: 'bar',
        data: data.map((item) => ({
          y: item.healthData[0].value,
          name: item.areaName,
        })),
        colorByPoint: true,
      },
    ],
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
      <H3>See how inequalities vary for a single period in time</H3>
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component' }}
        highcharts={Highcharts}
        options={barChartOptions}
      />
    </div>
  );
}
