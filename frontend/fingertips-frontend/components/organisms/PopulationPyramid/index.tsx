'use client';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { H3 } from 'govuk-react';
import { PreparedPopulationData } from '@/app/chart/page';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';

interface PyramidChartProps {
  data: PreparedPopulationData;
  populationPyramidTitle?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function PopulationPyramid({
  data,
  populationPyramidTitle,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<PyramidChartProps>) {
  // helper functions for HighCharts
  Highcharts.Templating.helpers.abs = (value) => Math.abs(value);

  const populationPyramidOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: 800,
    },
    title: { style: { display: 'none' } },
    legend: { verticalAlign: 'top', layout: 'horizontal' },
    xAxis: [
      {
        categories: data.dataForSelectedArea.ageCategories,
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
        categories: data.dataForSelectedArea.ageCategories,
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
        return pointFormatterHelper(this);
      },
      useHTML: true,
    },
    series: [
      {
        name: 'Female',
        type: 'bar',
        data: data.dataForSelectedArea.femaleSeries,
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
        data: data.dataForSelectedArea.maleSeries.map(
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
  if (data.dataForEngland && populationPyramidOptions.series) {
    populationPyramidOptions.series.push(
      {
        name: 'FAKE England Female',
        data: data.dataForEngland.femaleSeries,
        type: 'line',
        color: '#3D3D3D',
        dashStyle: 'Solid',
        marker: { symbol: 'circle' },
      },
      {
        name: 'FAKE England Male',
        data: data.dataForEngland.maleSeries,
        type: 'line',
        color: '#3D3D3D',
        dashStyle: 'Solid',
        marker: { symbol: 'circle' },
        showInLegend: false,
      }
    );
  }
  if (data.dataForBaseline && populationPyramidOptions.series) {
    populationPyramidOptions.series.push(
      {
        name: 'FAKE Baseline Female',
        type: 'line',
        data: data.dataForBaseline.femaleSeries,
        color: '#28A197',
        dashStyle: 'Dash',
        marker: { symbol: 'diamond' },
        dataLabels: { enabled: false },
      },
      {
        name: 'FAKE Baseline Male',
        type: 'line',
        data: data.dataForBaseline.maleSeries,
        color: '#28A197',
        dashStyle: 'Dash',
        marker: { symbol: 'diamond' },
        dataLabels: { enabled: false },
        showInLegend: false,
      }
    );
  }

  return (
    <div data-testid="PopulationPyramid-component">
      <H3>{populationPyramidTitle}</H3>
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component' }}
        highcharts={Highcharts}
        options={populationPyramidOptions}
      />
    </div>
  );
}
