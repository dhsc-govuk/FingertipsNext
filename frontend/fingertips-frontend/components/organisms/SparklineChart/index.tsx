'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { loadHighchartsModules } from '@/lib/chartHelpers/chartHelpers';

interface SparklineChartProps {
  value: (number | undefined)[];
  maxValue: number;
  confidenceIntervalValues: (number | undefined)[];
  showConfidenceIntervalsData: boolean;
  tooltipForBenchmark?: (string | number | undefined)[];
  tooltipForGroup?: (string | number | undefined)[];
  tooltipForArea?: (string | number | undefined)[];
}
export function SparklineChart({
  value,
  maxValue,
  confidenceIntervalValues,
  showConfidenceIntervalsData,
  tooltipForBenchmark,
  tooltipForGroup,
  tooltipForArea,
}: Readonly<SparklineChartProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();

  function formatSparklineTooltips() {
    if (tooltipForBenchmark) {
      return `<b>Benchmark: ${tooltipForBenchmark[0]}</b><br/>${tooltipForBenchmark[1]}<br/><br/><span style="color:{color}">\u25CF</span> ${value} ${tooltipForBenchmark[2]}`;
    }
    if (tooltipForGroup) {
      return `<b>Group: ${tooltipForGroup[0]}</b><br/>${tooltipForGroup[1]}<br/><br/><span style="color:{color}">\u25CF</span> ${value} ${tooltipForGroup[2]}`;
    }
    if (tooltipForArea) {
      return `<b>${tooltipForArea[0]}</b><br/>${tooltipForArea[1]}<br/><br/><span style="color:{color}">\u25CF</span> ${value} ${tooltipForArea[2]}`;
    }
  }

  const series: Highcharts.SeriesOptionsType[] = [
    { type: 'bar', data: [value] },
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
      formatter: formatSparklineTooltips,
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
