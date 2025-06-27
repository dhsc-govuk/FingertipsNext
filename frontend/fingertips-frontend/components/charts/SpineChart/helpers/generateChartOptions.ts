import Highcharts from 'highcharts';
import { SpineChartProps } from '../SpineChart/SpineChart';
import { generateSeriesData } from './generateSeriesData';

export function generateChartOptions(props: Readonly<SpineChartProps>) {
  const { quartileData, benchmarkValue } = props;
  const { q0Value, q1Value, q3Value, q4Value } = quartileData;
  if (
    q0Value === undefined ||
    q1Value === undefined ||
    q3Value === undefined ||
    q4Value === undefined ||
    benchmarkValue === undefined
  ) {
    return null;
  }

  const categories = [''];
  return {
    exporting: { enabled: false },
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      spacing: [0, 0, 0, 0],
      margin: [5, 5, 5, 5],
      height: 50,
      width: 400,
      inverted: true,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    title: {
      text: '',
    },
    accessibility: {
      enabled: false,
    },
    xAxis: [
      {
        categories: categories,
        visible: false,
        reversed: false,
        labels: {
          enabled: false,
          step: 1,
        },
        accessibility: {
          enabled: false,
        },
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: false,
        visible: false,
        categories: categories,
        linkedTo: 0,
        labels: {
          enabled: false,
          step: 1,
        },
        accessibility: {
          enabled: false,
        },
      },
    ],
    yAxis: {
      min: -1,
      max: 1,
      gridLineWidth: 0,
      title: {
        text: null,
      },
      labels: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
    },

    plotOptions: {
      bar: {
        stacking: 'normal',
        borderWidth: 0,
      },
    },
    tooltip: {
      outside: true,
      padding: 10,
      headerFormat: ``,
      pointFormatter: function (this: Highcharts.Point) {
        return this.series.name;
      },
      useHTML: true,
      style: {
        fontSize: 16,
      },
    },
    series: generateSeriesData(props),
  };
}
