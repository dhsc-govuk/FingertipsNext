'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { H3 } from 'govuk-react';
import { barChartDefaultOptions, getPlotline } from './barChartHelpers';

interface BarChartProps {
  healthIndicatorData: HealthDataForArea[];
  yAxisTitle?: string;
  accessibilityLabel?: string;
  benchmarkLabel?: string;
  benchmarkValue?: number;
  measurementUnit?: string;
}

export function BarChart({
  healthIndicatorData,
  yAxisTitle,
  accessibilityLabel,
  benchmarkLabel,
  benchmarkValue,
  measurementUnit,
}: Readonly<BarChartProps>) {
  const barChartOptions: Highcharts.Options = {
    ...barChartDefaultOptions,
    title: {
      ...barChartDefaultOptions.title,
      text: 'Bar chart to show how the indicator has changed over time for the area',
    },
    xAxis: {
      ...barChartDefaultOptions.xAxis,
      categories: healthIndicatorData.map((item) => item.areaName),
    },
    yAxis: {
      title: { text: yAxisTitle, margin: 20 },
      plotLines: [
        {
          ...getPlotline(benchmarkLabel, benchmarkValue),
        },
      ],
    },
    tooltip: {
      format:
        '<b>{point.category}</b><br/><br/><span style="color:{color}">\u25CF</span> Value {point.y}' +
        `${measurementUnit ?? ''}`,
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
        data: healthIndicatorData.map((item) => ({
          y: item.healthData[0].value,
          name: item.areaName,
        })),
        colorByPoint: true,
      },
    ],
    accessibility: {
      ...barChartDefaultOptions.accessibility,
      description: accessibilityLabel,
    },
  };

  return (
    <div data-testid="barChart-component">
      <H3>See how inequalities vary for a single period in time</H3>
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-barChart',
        }}
        highcharts={Highcharts}
        options={barChartOptions}
      />
    </div>
  );
}
