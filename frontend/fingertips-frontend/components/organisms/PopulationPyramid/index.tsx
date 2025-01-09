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
        tickWidth: 1,
        tickLength: 10,
        tickmarkPlacement: 'on',

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
        tickWidth: 1,
        tickLength: 10,
        tickmarkPlacement: 'on',
        accessibility: {
          description: '{xAxisTitle} degrees {series.name}',
        },
      },
    ],
    yAxis: {
      title: {
        text: yAxisTitle,
      },
      lineWidth: 5,
      lineColor: '#FF0000',
      tickWidth: 1,
      tickLength: 5,
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
        dataLabels: {
          enabled: true,
          inside: false,
          format: '{(point.y):.0f}',
          color: '#000000',
          style: {
            fontWeight: 'normal',
          },
        },
      },
      {
        name: 'Data / 2',
        type: 'line',
        data: singleYearValues.map((datapoint) => datapoint / 2),
        marker: { symbol: 'diamond' },
      },
      {
        name: 'negative of Data',
        type: 'bar',
        data: singleYearValues.map((datapoint) => -datapoint),
        dataLabels: {
          enabled: true,
          inside: false,
          format: '{(point.y):.0f}',
          color: '#000000',
          style: {
            fontWeight: 'normal',
          },
        },
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
