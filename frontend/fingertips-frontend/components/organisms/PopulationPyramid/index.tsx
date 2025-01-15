import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { H4 } from 'govuk-react';

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
  // helper functions
  Highcharts.Templating.helpers.initial = (label) => label.charAt(0);

  // get list of all the areas returned
  // max is expected to be 3 (selected, England & benchmark) but mock data does not yet support this
  const areaSeries = data.map((area) => area.areaCode ?? '');

  // sort the data
  // NOTE: for mock data this is just the first area, it will need to become for selected/england/baseline
  const ageSortedHealthData = data[0].healthData.sort((a, b) =>
    a.ageBand > b.ageBand ? -1 : 1
  );

  // get the age categories
  let ageCategories = ageSortedHealthData.map(
    (healthDataPoint) => healthDataPoint.ageBand
  );
  ageCategories = [...new Set(ageCategories)];

  // get the male and female data
  const FemaleHealthData = ageSortedHealthData.filter(
    (healthDataPoint) => healthDataPoint.sex === 'Female'
  );
  const MaleHealthData = ageSortedHealthData.filter(
    (healthDataPoint) => healthDataPoint.sex === 'Male'
  );

  // needs to become a %age
  const femaleSeries = FemaleHealthData.map((datapoint) => datapoint.count);
  const maleSeries = FemaleHealthData.map((datapoint) => -datapoint.count);

  const populationPyramidOptions: Highcharts.Options = {
    chart: { type: 'bar' },
    title: {
      text: populationPyramidTitle,
      style: {
        display: 'none',
      },
    },
    legend: { verticalAlign: 'top' },
    // accessibility: {
    //   point: {
    //     valueDescriptionFormat:
    //       '{point.category} Temperature: {(point.y)}°{initial series.name}',
    //   },
    // },
    xAxis: [
      {
        categories: ageCategories,
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
        format: '{value}',
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
    //     'Temperature: {(point.y)}°{initial series.name}',
    // },

    series: [
      {
        name: 'Female',
        type: 'bar',
        data: femaleSeries,
        color: '#5352BE',
        dataLabels: {
          enabled: true,
          inside: false,
          format: '{(point.y):.0f}',
          color: '#000000',
          style: {
            fontWeight: 'light',
          },
        },
      },

      {
        name: 'Male',
        type: 'bar',
        data: maleSeries,
        color: '#57AEF8',
        dataLabels: {
          enabled: true,
          inside: false,
          format: '{(point.y):.0f}',
          color: '#000000',
          style: {
            fontWeight: 'light',
          },
        },
      },
      {
        name: 'Female / 2',
        type: 'line',
        data: femaleSeries.map((datapoint) => datapoint / 2),
        color: '#3D3D3D',
        marker: { symbol: 'circle' },
        dataLabels: { enabled: false },
      },
      {
        name: 'Female / 3',
        type: 'line',
        data: femaleSeries.map((datapoint) => datapoint / 3),
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
