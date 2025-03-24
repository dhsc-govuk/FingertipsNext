'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { loadHighchartsModules } from '@/lib/chartHelpers/chartHelpers';
import { HealthDataPointBenchmarkComparison } from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { BenchmarkLabelType } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelTypes';

interface SparklineChartProps {
  value: (number | undefined)[];
  maxValue: number;
  confidenceIntervalValues: (number | undefined)[];
  showConfidenceIntervalsData: boolean;
  benchmarkComparison?: HealthDataPointBenchmarkComparison;
}

export function SparklineChart({
  value,
  maxValue,
  confidenceIntervalValues,
  showConfidenceIntervalsData,
  benchmarkComparison,
}: Readonly<SparklineChartProps>) {
  const color = getBenchmarkColour(
    benchmarkComparison?.outcome as BenchmarkLabelType
  );

  const [options, setOptions] = useState<Highcharts.Options>();

  const series: Highcharts.SeriesOptionsType[] = [
    { type: 'bar', data: [value], color },
  ];

  if (showConfidenceIntervalsData) {
    series.push({
      type: 'errorbar',
      data: [confidenceIntervalValues],
      color: GovukColours.Black,
      whiskerLength: '50%',
      lineWidth: 3,
    });
  }

  const sparklineOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'bar',
      height: 60,
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
    series: series,
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
