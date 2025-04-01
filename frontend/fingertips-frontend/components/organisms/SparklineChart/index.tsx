'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  generateConfidenceIntervalSeries,
  getBenchmarkColour,
  getConfidenceLimitNumber,
  loadHighchartsModules,
} from '@/lib/chartHelpers/chartHelpers';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { SparklineLabelEnum } from '@/components/organisms/BarChartEmbeddedTable';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { getBenchmarkLabelText } from '@/components/organisms/BenchmarkLabel';
import {formatNumber} from "@/lib/numberFormatter";

interface SparklineChartProps {
  value: (number | undefined)[];
  maxValue: number;
  confidenceIntervalValues: (number | undefined)[];
  showConfidenceIntervalsData: boolean;
  benchmarkOutcome?: BenchmarkOutcome;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  label: string;
  area: string | undefined;
  year: number | undefined;
  measurementUnit: string | undefined;
}

export const sparklineTooltipContent = (
  benchmarkOutcome: BenchmarkOutcome,
  label: string,
  benchmarkComparisonMethod: BenchmarkComparisonMethod
) => {
  let category = '';
  let benchmarkLabel = '';
  let comparisonLabel = '';
  const outcome = getBenchmarkLabelText(benchmarkOutcome);
  const comparison = getConfidenceLimitNumber(benchmarkComparisonMethod);

  if (label === SparklineLabelEnum.Benchmark && benchmarkOutcome) {
    category = 'Benchmark: ';
    return { benchmarkLabel, category, comparisonLabel };
  }
  if (label === SparklineLabelEnum.Group) {
    category = 'Group: ';
  }

  if (benchmarkOutcome === BenchmarkOutcome.Similar) {
    benchmarkLabel = `${outcome} to England`;
    comparisonLabel = `(${formatNumber(comparison)}%)`;
  } else if (
    benchmarkOutcome &&
    benchmarkOutcome !== BenchmarkOutcome.NotCompared
  ) {
    benchmarkLabel = `${outcome} than England`;
    comparisonLabel = `(${formatNumber(comparison)}%)`;
  }

  return { benchmarkLabel, category, comparisonLabel };
};

export function SparklineChart({
  value,
  maxValue,
  confidenceIntervalValues,
  showConfidenceIntervalsData,
  benchmarkOutcome = BenchmarkOutcome.NotCompared,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
  label,
  area,
  year,
  measurementUnit,
}: Readonly<SparklineChartProps>) {
  const color = getBenchmarkColour(
    benchmarkComparisonMethod,
    benchmarkOutcome,
    polarity
  );
  const [options, setOptions] = useState<Highcharts.Options>();

  const sparklineTooltips = (point: Highcharts.Point, symbol: string) => {
    const { benchmarkLabel, category, comparisonLabel } =
      sparklineTooltipContent(
        benchmarkOutcome,
        label,
        benchmarkComparisonMethod
      );

    return [
      `<b>${category}${area}</b><br/>${year}<br/><br/><span style="color:${point.color}">${symbol}</span><span> ${formatNumber(value[0])}${measurementUnit}</span><br/><span>${benchmarkLabel}</span><br/><span>${comparisonLabel}</span>`,
    ];
  };

  const confidenceIntervalSeries = generateConfidenceIntervalSeries(
    area,
    [confidenceIntervalValues],
    showConfidenceIntervalsData,
    { color: GovukColours.Black, whiskerLength: '50%', lineWidth: 3 }
  );

  const sparklineOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'bar',
      height: 90,
      width: 200,
      backgroundColor: 'transparent',
    },
    title: {
      style: {
        display: 'none',
      },
    },
    yAxis: { visible: false, min: 0, max: maxValue },
    xAxis: { visible: false },
    series: [{ type: 'bar', data: [value], color }, confidenceIntervalSeries],
    accessibility: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        pointWidth: 20,
        borderWidth: 0,
      },
      column: {
        pointPadding: 0.1,
      },
    },
    tooltip: {
      hideDelay: 0,
      style: {
        width: 200,
        overflow: 'visible',
      },
      outside: true,
      headerFormat: '',
      pointFormatter: function (this: Highcharts.Point) {
        return pointFormatterHelper(this, sparklineTooltips);
      },
    },
  };

  useEffect(() => {
    void loadHighchartsModules(() => {
      setOptions(sparklineOptions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConfidenceIntervalsData]);

  if (!options) {
    return null;
  }

  return (
    <HighchartsReact
      containerProps={{
        'data-testid': 'highcharts-react-component-barChartEmbeddedTable',
      }}
      highcharts={Highcharts}
      options={options}
    ></HighchartsReact>
  );
}
