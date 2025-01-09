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
    // accessibility: {
    //   point: {
    //     valueDescriptionFormat:
    //       '{point.category} Temperature: {(point.y)}°{initial series.name}',
    //   },
    // },
    xAxis: [
      {
        categories: areaCategories,
        title: { text: xAxisTitle },
        reversed: false,
        labels: {
          step: 1,
        },
        // accessibility: {
        //   description: '{xAxisTitle} degrees {series.name}',
        // },
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: true,
        categories: areaCategories,
        title: { text: xAxisTitle },
        linkedTo: 0,
        labels: {
          step: 1,
        },
        accessibility: {
          description: '{xAxisTitle} degrees {series.name}',
        },
      },
    ],
    yAxis: {
      title: {
        text: yAxisTitle,
      },
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
      },
      {
        name: 'negative of Data',
        type: 'bar',
        data: singleYearValues.map((datapoint) => -datapoint),
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
