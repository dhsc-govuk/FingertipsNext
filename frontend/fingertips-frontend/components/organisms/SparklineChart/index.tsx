'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  generateConfidenceIntervalSeries,
  getBenchmarkColour,
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

  const formatSparklineTooltips = (point: Highcharts.Point, symbol: string) => {
    let category = '';
    let benchmarkLabel = '';
    const outcome = getBenchmarkLabelText(benchmarkOutcome);

    if (label === SparklineLabelEnum.Benchmark && benchmarkOutcome) {
      category = 'Benchmark: ';
      benchmarkLabel = '';
    }
    if (label === SparklineLabelEnum.Group) {
      category = 'Group: ';
    }

    if (benchmarkOutcome === BenchmarkOutcome.Similar) {
      benchmarkLabel = `${outcome} to England`;
    } else if (
      benchmarkOutcome &&
      benchmarkOutcome !== BenchmarkOutcome.NotCompared
    ) {
      benchmarkLabel = `${outcome} than England`;
    }

    return [
      `<b>${category}${area}</b><br/>${year}<br/><br/><span style="color:${point.color}">${symbol}</span> ${value}${measurementUnit}<br/><span>${benchmarkLabel}</span>`,
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
        return pointFormatterHelper(this, formatSparklineTooltips);
      },
    },
  };

  useEffect(() => {
    loadHighchartsModules(() => {
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
