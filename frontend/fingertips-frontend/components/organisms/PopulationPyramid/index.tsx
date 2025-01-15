import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { H4 } from 'govuk-react';
import { preparePopulationData } from '@/lib/chartHelpers/preparePopulationData';

interface PyramidChartProps {
  data: HealthDataForArea[];
  populationPyramidTitle?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function PopulationPyramid({
  data,
  populationPyramidTitle: populationPyramidTitle,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<PyramidChartProps>) {
  // helper functions for HighCharts
  Highcharts.Templating.helpers.abs = (value) => Math.abs(value);

  // NOTE: for mock data this is just the first area [0], it will need to become for selected/england/baseline
  const populationDataForSelectedArea = preparePopulationData(
    data[0].healthData
  );

  const populationPyramidOptions: Highcharts.Options = {
    chart: { type: 'bar' },
    title: {
      text: populationPyramidTitle,
      style: {
        display: 'none',
      },
    },
    legend: { verticalAlign: 'top' },
    xAxis: [
      {
        categories: populationDataForSelectedArea.ageCategories,
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
        categories: populationDataForSelectedArea.ageCategories,
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
        format: '{abs value}',
      },
      accessibility: {
        enabled: false,
        description: accessibilityLabel,
      },
    },
    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },

    // tooltip: {
    //   format:
    //     '<b>{point.category}</b><br/>' +
    //     'Temperature: {(point.y)}°{firstChar series.name}',
    // },

    series: [
      {
        name: 'Female',
        type: 'bar',
        data: populationDataForSelectedArea.femaleSeries,
        color: '#5352BE',
        dataLabels: {
          enabled: true,
          inside: false,
          format: '{(abs point.y):.0f}',
          color: '#000000',
          style: {
            fontWeight: 'light',
          },
        },
      },

      {
        name: 'Male',
        type: 'bar',
        data: populationDataForSelectedArea.maleSeries.map(
          (datapoint) => -datapoint
        ),
        color: '#57AEF8',
        dataLabels: {
          enabled: true,
          inside: false,
          format: '{(abs point.y):.0f}',
          color: '#000000',
          style: {
            fontWeight: 'light',
          },
        },
      },
      {
        name: 'Female / 2',
        type: 'line',
        data: populationDataForSelectedArea.femaleSeries.map(
          (datapoint) => datapoint / 2
        ),
        color: '#3D3D3D',
        marker: { symbol: 'circle' },
        dataLabels: { enabled: false },
      },
      {
        name: 'Female / 3',
        type: 'line',
        data: populationDataForSelectedArea.femaleSeries.map(
          (datapoint) => datapoint / 3
        ),
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
