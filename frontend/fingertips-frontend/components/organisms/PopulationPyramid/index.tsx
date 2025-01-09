import { HealthCareData } from '@/app/chart/health-data';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface PyramidChartProps {
  data: HealthCareData[];
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  accessibilityLabel?: string;
}

export function PopulationPyramid({
  data,
  title,
  xAxisTitle,
  yAxisTitle,
  accessibilityLabel,
}: Readonly<PyramidChartProps>) {
  // helper functions
  Highcharts.Templating.helpers.initial = (label) => label.charAt(0);

  const areaCategories = data.map((datapoint) => datapoint.areaCode ?? '');

  const singleYearValues = data.map(
    (datapoint) => datapoint.healthData[0].value ?? null
  );

  const populationPyramidOptions: Highcharts.Options = {
    chart: { type: 'bar' },
    title: { text: title },
    legend: { verticalAlign: 'top' },
    // accessibility: {
    //   point: {
    //     valueDescriptionFormat:
    //       '{point.category} Temperature: {(point.y)}°{initial series.name}',
    //   },
    // },
    xAxis: [
      {
        categories: areaCategories,
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
        // reversed: false,
        // labels: {
        //   step: 1,
        // },
        // accessibility: {
        //   description: '{xAxisTitle} degrees {series.name}',
        // },
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: true,
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
        name: 'Data',
        type: 'bar',
        data: singleYearValues,
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
        name: 'Negative of Data',
        type: 'bar',
        data: singleYearValues.map((datapoint) => -datapoint),
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
        name: 'Data / 2',
        type: 'line',
        data: singleYearValues.map((datapoint) => datapoint / 2),
        color: '#3D3D3D',
        marker: { symbol: 'circle' },
        dataLabels: { enabled: false },
      },
      {
        name: 'Data / 3',
        type: 'line',
        data: singleYearValues.map((datapoint) => datapoint / 3),
        color: '#28A197',
        dashStyle: 'Dash',
        marker: { symbol: 'diamond' },
        dataLabels: { enabled: false },
      },
    ],
  };

  return (
    <div data-testid="populationPyramid-component">
      <HighchartsReact
        highcharts={Highcharts}
        options={populationPyramidOptions}
      />
    </div>
  );
}
