import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { generateChartOptions } from './SpineChartOptions';

export interface SpineChartProps {
  name: string;
  units: string;
  period: number;
  benchmarkValue: number;
  quartileData: QuartileData;
  areaOneValue?: number;
  areaOneOutcome?: BenchmarkOutcome;
  areaTwoValue?: number;
  areaTwoOutcome?: BenchmarkOutcome;
  areaNames: string[];
  benchmarkMethod?: BenchmarkComparisonMethod;
  groupValue?: number;
  groupName: string;
  groupOutcome?: BenchmarkOutcome;
}

function absDiff(value: number, benchmark: number): number {
  return Math.abs(Math.abs(value) - Math.abs(benchmark));
}

function buildNameString(
  lowerName: string,
  lowerValue: number,
  upperName: string,
  upperValue: number,
  units: string
): string {
  return (
    '<span>' + 
    lowerValue +
    units +
    ' to ' +
    upperValue +
    units +
    '</span>' +
    '<span>' +
    lowerName +
    ' to ' +
    upperName +
    '</span>'
  );
}

export function generateSeriesData({
  units,
  benchmarkValue,
  quartileData,
  areaOneValue,
  areaOneOutcome,
  areaTwoValue,
  areaTwoOutcome,
  groupValue,
  benchmarkMethod,
}: Readonly<SpineChartProps>) {
  const {
    best,
    bestQuartile: upperQuartile,
    worstQuartile: lowerQuartile,
    worst,
  } = orderStatistics(quartileData);

  const maxDiffFromBenchmark = Math.max(
    absDiff(best, benchmarkValue),
    absDiff(worst, benchmarkValue)
  );

  const scaledFirstQuartileBar =
    absDiff(best, upperQuartile) / maxDiffFromBenchmark;
  const scaledSecondQuartileBar =
    absDiff(upperQuartile, benchmarkValue) / maxDiffFromBenchmark;
  const scaledThirdQuartileBar =
    absDiff(lowerQuartile, benchmarkValue) / maxDiffFromBenchmark;
  const scaledFourthQuartileBar =
    absDiff(worst, lowerQuartile) / maxDiffFromBenchmark;

  const seriesData: (
    | Highcharts.SeriesBarOptions
    | Highcharts.SeriesScatterOptions
  )[] = [
    {
      type: 'bar',
      name: buildNameString(
        'Worst',
        worst,
        '25th percentile',
        worstQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.MidGrey,
      data: [-scaledFourthQuartileBar],
    },
    {
      type: 'bar',
      name: buildNameString(
        'Best',
        best,
        '75th percentile',
        bestQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.MidGrey,
      data: [scaledFirstQuartileBar],
    },
    {
      type: 'bar',
      name: buildNameString(
        '25th percentile',
        worstQuartile,
        '75th percentile',
        bestQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.DarkGrey,
      data: [-scaledThirdQuartileBar],
    }
    {
      type: 'bar',
      name: buildNameString(
        '25th percentile',
        worstQuartile,
        '75th percentile',
        bestQuartile,
        units
      ),
      pointWidth: 30,
      color: GovukColours.MidGrey,
      data: [],
    },
  ];

  const inverter =
    quartileData.polarity === IndicatorPolarity.LowIsGood ? -1 : 1;

  if (groupValue !== undefined) {
    const absGroupValue =
      inverter * (Math.abs(groupValue) - Math.abs(benchmarkValue));
    const scaledGroup = absGroupValue / maxDiffFromBenchmark;
    seriesData.push({
      type: 'scatter',
      name: 'Group',
      marker: {
        symbol: 'diamond',
        radius: 8,
        fillColor: '#fff',
        lineColor: '#000',
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

    const absAreaValue =
      inverter * (Math.abs(value) - Math.abs(benchmarkValue));
    const scaledArea = absAreaValue / maxDiffFromBenchmark;
    seriesData.push({
      type: 'scatter',
      name: `Area ${outcome}`,
      marker: {
        symbol: index === 0 ? 'circle' : 'square',
        radius: 6,
        fillColor,
        lineColor: '#000',
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

export const generateSpineChartTooltipForPoint = (
  point: Highcharts.Point,
  symbol: string
) => [
  `<span style="color:${point.color}">${symbol}</span>`
];

export function generateChartOptions(props: Readonly<SpineChartProps>) {
  const categories = [''];

  return {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      spacing: [0, 0, 0, 0],
      margin: [5, 5, 5, 5],
      height: 130,
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
        enabled: false,
      },
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
      padding: 10,
      headerFormat: `<div style="margin:0px; padding:0px;">
            <span style="font-weight: bold; display: block;">
            Benchmark: England
            </span>
            <span>`+ props.period+ `</span>
            <span>{props.name}</span>
            <span>{series.name}</span><div>`,
      pointFormatter: function (this: Highcharts.Point) {
        return pointFormatterHelper(this, generateSpineChartTooltipForPoint);
      },
      useHTML: true,
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
