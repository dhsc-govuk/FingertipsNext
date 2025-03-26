'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  getBenchmarkColour,
  loadHighchartsModules,
} from '@/lib/chartHelpers/chartHelpers';
import { BenchmarkOutcome } from '@/generated-sources/ft-api-client';
import { BenchmarkLabelType } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelTypes';
import { SparklineLabelEnum } from '@/components/organisms/BarChartEmbeddedTable';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';

interface SparklineChartProps {
  value: (number | undefined)[];
  maxValue: number;
  confidenceIntervalValues: (number | undefined)[];
  showConfidenceIntervalsData: boolean;
  benchmarkOutcome?: BenchmarkOutcome;
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
  benchmarkOutcome,
  label,
  area,
  year,
  measurementUnit,
}: Readonly<SparklineChartProps>) {
  const color = getBenchmarkColour(benchmarkOutcome as BenchmarkLabelType);
  const [options, setOptions] = useState<Highcharts.Options>();
  
  const formatSparklineTooltips = (point: Highcharts.Point, symbol: string) => {
    let category = '';
    
    if (label === SparklineLabelEnum.Benchmark) {
      category = 'Benchmark: ';
    }
    if (label === SparklineLabelEnum.Group) {
      category = 'Group: ';
    }
   
    return [`<b>${category}${area}</b><br/>${year}<br/><br/><span style="color:${point.color}">${symbol}</span> ${value} ${measurementUnit}`];
  }

  const confidenceIntervalColor = GovukColours.Black;
  const whiskerLength = '50%';
  const lineWidth = 3;

  function generateConfidenceIntervalSeries(
    areaName: string | undefined,
    data: (number | undefined)[][],
    showConfidenceIntervalsData?: boolean
  ): Highcharts.SeriesOptionsType {
    return {
      type: 'errorbar',
      name: areaName,
      data: data,
      visible: showConfidenceIntervalsData,
      color: `${confidenceIntervalColor}`,
      whiskerLength: `${whiskerLength}`,
      lineWidth: Number(`${lineWidth}`),
    };
  }

  const confidenceIntervalSeries = generateConfidenceIntervalSeries(
    area,
    [confidenceIntervalValues],
    showConfidenceIntervalsData
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
        return pointFormatterHelper(this, formatSparklineTooltips)
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
