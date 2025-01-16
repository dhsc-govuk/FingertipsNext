import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { H4 } from 'govuk-react';
import { preparePopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { PreparedPopulationData } from '@/app/chart/page';

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

  // ensure symetrical axes
  // TODO: fix magic number - see getExtremes/setExtremes
  const yAxisLimit = 7;

  const populationPyramidOptions: Highcharts.Options = {
    chart: { type: 'bar', height: 1086 },
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
      max: yAxisLimit,
      min: -yAxisLimit,
    },
    plotOptions: {
      series: { stacking: 'normal' },
    },
    tooltip: {
      padding: 20,
      format:
        // TODO: add symbol
        '<span style="font-weight: bold">AreaName</span><br/>' +
        '<span>Age {point.category}</span><br/></br>' +
        '<span>{point.graphic.symbolName}</span><br/>' +
        '<span>Value {point.y}%</span><br/>' +
        '<span>{series.name}</span><br/>',
    },
    series: [
      {
        name: 'Female',
        type: 'bar',
        data: data.dataForSelectedArea.femaleSeries,
        xAxis: 0,
        color: '#5352BE',
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
        name: 'FAKE England Female',
        type: 'line',
        data: data.dataForEngland.femaleSeries,
        color: '#3D3D3D',
        marker: { symbol: 'circle' },
        dataLabels: {
          enabled: true,
          format: '{(point.y):.3f}%',
        },
        yAxis: 0,
      },
      {
        name: 'FAKE England Male',
        type: 'line',
        data: data.dataForEngland.maleSeries,
        color: '#3D3D3D',
        marker: { symbol: 'circle' },
        dataLabels: {
          enabled: true,
          format: '{(point.y):.3f}%',
        },
        yAxis: 0,
      },
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
      },
    ],
  };

  return (
    <div data-testid="PopulationPyramid-component">
      <H4>{populationPyramidTitle}</H4>
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component' }}
        highcharts={Highcharts}
        options={populationPyramidOptions}
      />
    </div>
  );
}
