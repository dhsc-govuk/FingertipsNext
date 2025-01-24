'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { H3 } from 'govuk-react';

interface ScatterChartProps {
  ScatterChartTitle?: string;
  data: HealthDataForArea[] | undefined;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function ScatterChart({
  ScatterChartTitle: scatterChartTitle,
  data,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<ScatterChartProps>) {
  const scatterChartOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'scatter',
      height: '50%',
      spacingBottom: 50,
      spacingTop: 30,
    },
    title: {
      text: 'Scatter chart to show how the indicator has changed over time for the area',
      style: {
        display: 'none',
      },
    },
    xAxis: {
      title: {
        text: xAxisTitle,
        style: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      },
      tickLength: 0,
    },
    yAxis: {
      title: {
        text: yAxisTitle,
        style: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      },
    },
    series: [
      {
        type: 'scatter',
        data: data?.flatMap((item) =>
          item.healthData.map((healthItem, index) => [index, healthItem.value])
        ),
      },
    ],
    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
  };
  return (
    <div data-testid="scatterChart-component">
      <H3>{scatterChartTitle}</H3>
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component' }}
        highcharts={Highcharts}
        options={scatterChartOptions}
      ></HighchartsReact>
    </div>
  );
}
