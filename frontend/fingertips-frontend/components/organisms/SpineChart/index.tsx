import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { orderStatistics } from './SpineChartHelpers';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';

export interface SpineChartProps {
  benchmarkValue: number;
  quartileData: QuartileData;
  areaOneValue?: number;
  areaOneOutcome?: BenchmarkOutcome;
  areaTwoValue?: number;
  areaTwoOutcome?: BenchmarkOutcome;
  benchmarkMethod?: BenchmarkComparisonMethod;
  groupValue?: number;
}

function absDiff(value: number, benchmark: number): number {
  return Math.abs(Math.abs(value) - Math.abs(benchmark));
}

const markerLineWidth = 0;

export function generateSeriesData({
  benchmarkValue,
  quartileData,
  areaOneValue,
  areaOneOutcome,
  areaTwoValue,
  areaTwoOutcome,
  groupValue,
  benchmarkMethod,
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

  const seriesData: (
    | Highcharts.SeriesBarOptions
    | Highcharts.SeriesScatterOptions
  )[] = [
    {
      type: 'bar',
      name: 'Worst',
      color: GovukColours.MidGrey,
      data: [-scaledWorst],
    },
    {
      type: 'bar',
      name: 'Best',
      color: GovukColours.MidGrey,
      data: [scaledBest],
    },
    {
      type: 'bar',
      name: '25th percentile',
      color: GovukColours.DarkGrey,
      data: [-scaledWorstQuartile],
    },
    {
      type: 'bar',
      name: '75th percentile',
      color: GovukColours.DarkGrey,
      data: [scaledBestQuartile],
    },
  ];

  if (groupValue !== undefined) {
    const absGroupValue = Math.abs(
      Math.abs(groupValue) - Math.abs(benchmarkValue)
    );
    const scaledGroup = absGroupValue / maxValue;
    seriesData.push({
      type: 'scatter',
      name: 'Group',
      marker: {
        symbol: 'diamond',
        radius: 8,
        fillColor: '#fff',
        lineColor: '#fff',
        lineWidth: markerLineWidth,
      },
      data: [scaledGroup],
    });
  }

  const areas = [
    { value: areaOneValue, outcome: areaOneOutcome },
    { value: areaTwoValue, outcome: areaTwoOutcome },
  ];
  areas.forEach(({ value, outcome }, index) => {
    if (value === undefined) return;
    const fillColor = getBenchmarkColour(
      benchmarkMethod ?? BenchmarkComparisonMethod.Unknown,
      outcome ?? BenchmarkOutcome.NotCompared,
      quartileData.polarity ?? IndicatorPolarity.NoJudgement
    );

    const absAreaValue = Math.abs(Math.abs(value) - Math.abs(benchmarkValue));
    const scaledArea = absAreaValue / maxValue;
    seriesData.push({
      type: 'scatter',
      name: `Area ${outcome}`,
      marker: {
        symbol: index === 0 ? 'circle' : 'square',
        radius: 6,
        fillColor,
        lineColor: '#fff',
        lineWidth: markerLineWidth,
      },
      data: [scaledArea],
    });
  });

  if (benchmarkValue !== undefined) {
    seriesData.push({
      type: 'scatter',
      name: 'Benchmark',
      visible: false,
      marker: {
        symbol: 'circle',
        radius: 2,
        fillColor: '#000',
      },
      data: [0],
    });
  }

  return seriesData;
}

export function generateChartOptions(props: Readonly<SpineChartProps>) {
  const categories = ['Important stat'];

  return {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      spacingBottom: 0,
      spacingTop: 0,
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
    series: generateSeriesData(props),
  };
}

export function SpineChart(props: Readonly<SpineChartProps>) {
  const spineChartsOptions = generateChartOptions(props);
  const { benchmarkValue } = props;
  return (
    <div data-testid={`spineChart-component`}>
      <HighchartsReact
        containerProps={{
          'data-testid': 'highcharts-react-component-spineChart',
        }}
        highcharts={Highcharts}
        options={spineChartsOptions}
        callback={(chart: Highcharts.Chart) => {
          if (!chart) return;
          if (!benchmarkValue) return;
          if (!chart.series.length) return;

          const benchmarkPoint =
            chart.series[chart.series.length - 1].points[0];

          const pos = benchmarkPoint.pos(true, benchmarkPoint.plotY);

          if (!pos) return;

          const [x, y] = pos;
          chart.renderer
            .rect(x - 1, y - 20, 2, 40)
            .attr({ fill: '#000', zIndex: 5 })
            .add();
        }}
      />
    </div>
  );
}
