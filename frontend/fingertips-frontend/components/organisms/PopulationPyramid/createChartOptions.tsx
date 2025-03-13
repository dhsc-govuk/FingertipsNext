import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import Highcharts, { Axis, Tick } from 'highcharts';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';

export const createChartOptions = (
  xAxisTitle: string,
  yAxisTitle: string,
  dataForArea: PopulationDataForArea,
  accessibilityLabel: string
): Highcharts.Options => {
  return {
    chart: {
      type: 'bar',
      height: 800,
    },
    credits: { enabled: false },
    title: { style: { display: 'none' } },
    legend: { verticalAlign: 'top', layout: 'horizontal' },
    xAxis: [
      {
        categories: dataForArea.ageCategories,
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
        categories: dataForArea?.ageCategories,
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
        format: '{abs value} %',
        align: 'center',
      },
      accessibility: {
        enabled: false,
        description: accessibilityLabel,
      },
      tickInterval: 1,
      // tickPositioner: (axis: Axis) => {
      //   if (!axis.isXAxis) {
      //     return [
      //       new Tick(axis, -100, "bar", false),
      //       new Tick(axis, 0, "bar", false),
      //       new Tick(axis, 100, "bar", false)
      //     ]

      //   }
      // },
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
        data: dataForArea.femaleSeries,
        xAxis: 0,
        color: '#5352BE',
        pointWidth: 17,
      },
      {
        name: 'Male',
        type: 'bar',
        data: dataForArea.maleSeries.map((datapoint) => -datapoint),
        xAxis: 1,
        color: '#57AEF8',
        pointWidth: 17,
      },
    ],
    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
  };
};
