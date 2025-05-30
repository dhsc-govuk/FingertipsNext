'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { H3 } from 'govuk-react';
import { sortHealthDataByYearDescending } from '@/lib/chartHelpers/chartHelpers';

interface ScatterChartProps {
  scatterChartTitle?: string;
  healthIndicatorData: HealthDataForArea[][];
  xAxisTitle?: string;
  xAxisSubtitle?: string;
  yAxisTitle?: string;
  yAxisSubtitle?: string;
  accessibilityLabel?: string;
}

export function ScatterChart({
  scatterChartTitle,
  healthIndicatorData,
  xAxisTitle,
  xAxisSubtitle,
  yAxisTitle,
  yAxisSubtitle,
  accessibilityLabel,
}: Readonly<ScatterChartProps>) {
  const sortedDataSet1 = sortHealthDataByYearDescending(healthIndicatorData[0]);
  const dataSet1plotValues = sortedDataSet1.map(
    (item) => item.healthData[0].value
  );

  const sortedDataSet2 = sortHealthDataByYearDescending(healthIndicatorData[1]);
  const dataSet2plotValues = sortedDataSet2.map(
    (item) => item.healthData[0].value
  );

  const combinedDataPlots = dataSet1plotValues.map((item, index) => [
    item,
    dataSet2plotValues[index],
  ]);

  const scatterChartOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'scatter',
      height: '50%',
      spacingBottom: 50,
      spacingTop: 40,
      animation: false,
    },
    title: {
      text: 'Scatter chart to show how the indicator has changed over time for the area',
      style: {
        display: 'none',
      },
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
      y: -30,
      margin: 40,
      title: {
        text: 'Selected areas',
      },
    },
    xAxis: {
      title: {
        text: `<span style="font-weight: bold">${xAxisTitle}</span><br><span>${xAxisSubtitle}</span>`,
        useHTML: true,
        style: {
          fontSize: 16,
        },
      },
      tickLength: 0,
    },
    yAxis: {
      title: {
        text: `<span style="font-weight: bold">${yAxisTitle}</span><br><span>${yAxisSubtitle}</span>`,
        useHTML: true,
        style: {
          fontSize: 16,
        },
      },
    },
    series: [
      {
        type: 'scatter',
        name: 'AreaCodes',
        data: combinedDataPlots,
      },
    ],
    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
    plotOptions: {
      series: {
        animation: false,
      },
    },
  };
  return (
    <div data-testid="scatterChart-component">
      <H3>{scatterChartTitle}</H3>
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-scatterChart',
        }}
        highcharts={Highcharts}
        options={scatterChartOptions}
      ></HighchartsReact>
    </div>
  );
}
