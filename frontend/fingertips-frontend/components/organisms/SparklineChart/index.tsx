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
  tooltipData: (string | number | undefined)[];
}
export function SparklineChart({
  value,
  maxValue,
  confidenceIntervalValues,
  showConfidenceIntervalsData,
  tooltipData,
}: Readonly<SparklineChartProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();
  
  if(!tooltipData) {
    return null;
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
      format:
        `<b>${tooltipData[0]}</b><br/>${tooltipData[1]}<br/><br/><span style="color:{color}">\u25CF</span> ${value} ${tooltipData[2]}`
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
