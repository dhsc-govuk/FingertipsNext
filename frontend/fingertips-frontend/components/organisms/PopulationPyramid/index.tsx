'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { H3 } from 'govuk-react';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';

interface PyramidChartProps {
  healthIndicatorData: PopulationData;
  populationPyramidTitle?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export const generatePopPyramidTooltipStringList = (
  point: Highcharts.Point,
  symbol?: string
) => [
  `<span style="color:${point.series.color}">${symbol}</span>`,
  `<span> Value ${Math.abs(point.y!)}%<br/>${point.series.name}</span>`,
];

export function PopulationPyramid({
  healthIndicatorData,
  populationPyramidTitle,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<PyramidChartProps>) {
  Highcharts.Templating.helpers.abs = (value) => Math.abs(value);

  const populationPyramidOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: 800,
    },
    credits: { enabled: false },
    title: { style: { display: 'none' } },
    legend: { verticalAlign: 'top', layout: 'horizontal' },
    xAxis: [
      {
        categories: healthIndicatorData.dataForSelectedArea?.ageCategories,
        title: {
          text: xAxisTitle,
          align: 'high',
          offset: 2,
          rotation: 0,
        },
        lineColor: '#D7D7D7',
        tickWidth: 1,
        tickLength: 10,
        tickmarkPlacement: 'on',
        tickColor: '#D7D7D7',
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: healthIndicatorData.dataForSelectedArea?.ageCategories,
        linkedTo: 0,
        title: {
          text: xAxisTitle,
          align: 'high',
          offset: 4,
          rotation: 0,
        },
        lineColor: '#D7D7D7',
        tickWidth: 1,
        tickLength: 10,
        tickmarkPlacement: 'on',
        tickColor: '#D7D7D7',
        accessibility: {
          description: '{xAxisTitle} degrees {series.name}',
        },
      },
    ],
    yAxis: {
      title: {
        text: yAxisTitle,
      },
      lineWidth: 1,
      lineColor: '#D7D7D7',
      tickWidth: 1,
      tickLength: 5,
      tickColor: '#D7D7D7',
      gridLineWidth: 0,
      labels: {
        format: '{abs value}%',
      },
      tickInterval: 1,
      accessibility: {
        enabled: false,
        description: accessibilityLabel,
      },
    },
    tooltip: {
      padding: 10,
      headerFormat:
        '<span style="font-weight: bold">AreaName</span><br/>' +
        '<span>Age {key}</span><br/>',
      pointFormatter: function (this: Highcharts.Point) {
        return pointFormatterHelper(this, generatePopPyramidTooltipStringList);
      },
      useHTML: true,
    },
    series: [
      {
        name: 'Female',
        type: 'bar',
        data: healthIndicatorData.dataForSelectedArea?.femaleSeries,
        xAxis: 0,
        color: '#5352BE',
        pointWidth: 17,
        dataLabels: {
          enabled: true,
          inside: false,
          format: '{(abs point.y):.1f}%',
          color: '#000000',
          style: {
            fontWeight: 'light',
          },
        },
      },
      {
        name: 'Male',
        type: 'bar',
        data: healthIndicatorData.dataForSelectedArea?.maleSeries.map(
          (datapoint) => -datapoint
        ),
        xAxis: 1,
        color: '#57AEF8',
        pointWidth: 17,
        dataLabels: {
          enabled: true,
          inside: false,
          format: '{(abs point.y):.1f}%',
          color: '#000000',
          style: {
            fontWeight: 'light',
          },
        },
      },
    ],
    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
  };

  // add comparitors to series if they exist
  if (healthIndicatorData.dataForEngland && populationPyramidOptions.series) {
    populationPyramidOptions.series.push(
      {
        name: 'England',
        data: healthIndicatorData.dataForEngland.femaleSeries,
        type: 'line',
        color: '#3D3D3D',
        dashStyle: 'Solid',
        marker: { symbol: 'circle' },
      },
      {
        name: 'England',
        data: healthIndicatorData.dataForEngland.maleSeries.map(
          (datapoint) => -datapoint
        ),
        type: 'line',
        color: '#3D3D3D',
        dashStyle: 'Solid',
        marker: { symbol: 'circle' },
        showInLegend: false,
      }
    );
  }
  if (healthIndicatorData.dataForBaseline && populationPyramidOptions.series) {
    populationPyramidOptions.series.push(
      {
        name: 'Baseline',
        type: 'line',
        data: healthIndicatorData.dataForBaseline.femaleSeries,
        color: '#28A197',
        dashStyle: 'Dash',
        marker: { symbol: 'diamond' },
        dataLabels: { enabled: false },
      },
      {
        name: 'Baseline',
        type: 'line',
        data: healthIndicatorData.dataForBaseline.maleSeries.map(
          (datapoint) => -datapoint
        ),
        color: '#28A197',
        dashStyle: 'Dash',
        marker: { symbol: 'diamond' },
        dataLabels: { enabled: false },
        showInLegend: false,
      }
    );
  }

  return (
    <div data-testid="populationPyramid-component">
      <H3>{populationPyramidTitle}</H3>
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-populationPyramid',
        }}
        highcharts={Highcharts}
        options={populationPyramidOptions}
      />
    </div>
  );
}
