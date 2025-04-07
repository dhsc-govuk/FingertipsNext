import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { QuartileData } from '@/generated-sources/ft-api-client';
import { orderStatistics } from './SpineChartHelpers';

export interface SpineChartProps {
  benchmarkValue: number;
  quartileData: QuartileData;
}

function absDiff(value: number, benchmark: number): number {
  return Math.abs(Math.abs(value) - Math.abs(benchmark));
}

export function generateSeriesData({
  benchmarkValue,
  quartileData,
}: Readonly<SpineChartProps>) {
  const { best, bestQuartile, worstQuartile, worst } =
    orderStatistics(quartileData);

  const absBest = absDiff(best, benchmarkValue);
  const absdWorst = absDiff(worst, benchmarkValue);
  const absBestQuartile = absDiff(bestQuartile, benchmarkValue);
  const absWorstQuartile = absDiff(worstQuartile, benchmarkValue);

  const maxValue = Math.max(absBest, absdWorst);

  const scaledBest = absBest / maxValue;
  const scaledWorst = absdWorst / maxValue;
  const scaledBestQuartile = absBestQuartile / maxValue;
  const scaledWorstQuartile = absWorstQuartile / maxValue;

  return [
    {
      name: 'Worst',
      color: GovukColours.MidGrey,
      data: [-scaledWorst],
    },
    {
      name: 'Best',
      color: GovukColours.MidGrey,
      data: [scaledBest],
    },
    {
      name: '25th percentile',
      color: GovukColours.DarkGrey,
      data: [-scaledWorstQuartile],
    },
    {
      name: '75th percentile',
      color: GovukColours.DarkGrey,
      data: [scaledBestQuartile],
    },
  ];
}

export function generateChartOptions({
  benchmarkValue,
  quartileData,
}: Readonly<SpineChartProps>) {
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

    series: generateSeriesData({ benchmarkValue, quartileData }),
  };
}

export function SpineChart({
  benchmarkValue,
  quartileData,
}: Readonly<SpineChartProps>) {
  const spineChartsOptions = generateChartOptions({
    benchmarkValue,
    quartileData,
  });

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
