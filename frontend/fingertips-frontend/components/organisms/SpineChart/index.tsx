import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { QuartileData } from '@/generated-sources/ft-api-client';
import { orderStatistics } from './SpineChartHelpers';

export interface SpineChartProps {
  value: number;
  quartileData: QuartileData;
}

export function generateSeriesData() {
  return [
    {
      name: 'Worst',
      color: GovukColours.MidGrey,
      data: [-1.38],
    },
    {
      name: 'Best',
      color: GovukColours.MidGrey,
      data: [1.35],
    },
    {
      name: '25th percentile',
      color: GovukColours.DarkGrey,
      data: [-0.78],
    },
    {
      name: '75th percentile',
      color: GovukColours.DarkGrey,
      data: [0.55],
    },
  ];
}

export function generateChartOptions({
  value,
  quartileData,
}: Readonly<SpineChartProps>) {
  const {best,
    bestQuartile,
    worstQuartile,
    worst,
    } = orderStatistics(quartileData)

  const categories = ['Important stat'];

  return {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      spacingBottom: 0,
      spacingTop: 0,
      height: 30,
      width: 400,
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
      point: {
        valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.',
      },
    },
    xAxis: [
      {
        categories: categories,
        reversed: false,
        labels: {
          enabled: false,
          step: 1,
        },
        accessibility: {
          description: 'Age (male)',
        },
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: categories,
        linkedTo: 0,
        labels: {
          enabled: false,
          step: 1,
        },
        accessibility: {
          description: 'Age (female)',
        },
      },
    ],
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: false,
      },
      accessibility: {
        description: 'Percentage population',
        rangeDescription: 'Range: 0 to 5%',
      },
    },

    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },

    tooltip: {
      format:
        '<b>{series.name}, age {point.category}</b><br/>' +
        'Population: {(abs point.y):.2f}%',
    },

    series: generateSeriesData(),
  };
}

export function SpineChart({
  value,
  quartileData,
}: Readonly<SpineChartProps>) {
  const spineChartsOptions = generateChartOptions(value, quartileData);

  return (
    <div data-testid={`spineChart-component`}>
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-spineChart',
        }}
        highcharts={Highcharts}
        options={spineChartsOptions}
      />
    </div>
  );
}
