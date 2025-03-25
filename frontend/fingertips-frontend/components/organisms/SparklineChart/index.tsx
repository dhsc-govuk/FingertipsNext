'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { loadHighchartsModules } from '@/lib/chartHelpers/chartHelpers';
import { SparklineLabelEnum } from '@/components/organisms/BarChartEmbeddedTable';

interface SparklineChartProps {
  value: (number | undefined)[];
  maxValue: number;
  confidenceIntervalValues: (number | undefined)[];
  showConfidenceIntervalsData: boolean;
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
  label,
  area,
  year,
  measurementUnit,
}: Readonly<SparklineChartProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();

  function formatSparklineTooltips() {
    let category = '';
    if (label === SparklineLabelEnum.Benchmark) {
      category = 'Benchmark: ';
    }
    if (label === SparklineLabelEnum.Group) {
      category = 'Group: ';
    }
    return `<b>${category} ${area}</b><br/>${year}<br/><br/><span style="color:{color}">\u25CF</span> ${value} ${measurementUnit}`;
  }

  const color = GovukColours.Black;
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
      color: `${color}`,
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
      height: 80,
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
    series: [{ type: 'bar', data: [value] }, confidenceIntervalSeries],
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
      formatter: formatSparklineTooltips,
      borderWidth: 0,
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
