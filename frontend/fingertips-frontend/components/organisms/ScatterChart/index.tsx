'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { H3 } from 'govuk-react';
import { sortHealthDataByDate } from '@/lib/chartHelpers/formatChartValues';

interface ScatterChartProps {
  ScatterChartTitle?: string;
  data: HealthDataForArea[][];
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
  
  const sortedDataSet1 = sortHealthDataByDate(data[0]);
  const dataSet1plotValues = sortedDataSet1.map(
    (item) => item.healthData[0].value
  );

  const sortedDataSet2 = sortHealthDataByDate(data[1]);
  const dataSet2plotValues = sortedDataSet2.map(
    (item) => item.healthData[1].value
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
          fontSize: 16,
        },
      },
      tickLength: 0,
    },
    yAxis: {
      title: {
        text: yAxisTitle,
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
    legend: {
      align: 'left',
      verticalAlign: 'top',
      margin: 30,
    },
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
