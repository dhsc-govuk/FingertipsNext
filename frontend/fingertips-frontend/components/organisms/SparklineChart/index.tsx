'use client';

import { HighchartsReact } from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useEffect, useState } from 'react';

interface SparklineChartProps {
  value: (number | undefined)[];
  maxValue: number;
  errorBarValues: (number | undefined)[];
  showConfidenceIntervalsData?: string[];
}
export function SparklineChart({
  value,
  maxValue,
  errorBarValues,
}: Readonly<SparklineChartProps>) {
  console.log('SparklineChart', errorBarValues);
  
  const [options, setOptions] = useState<Highcharts.Options>();
  const loadHighchartsModules = async (callback: () => void) => {
    await import('highcharts/highcharts-more').then(callback);
  };

  const sparklineOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'bar',
      height: 60,
      width: 200,
      backgroundColor: 'transparent',
      // padding: '50',
    },
    title: {
      style: {
        display: 'none',
      },
    },
    yAxis: { visible: false, min: 0, max: maxValue },
    xAxis: { visible: false },
    series: [{ type: 'bar', data: [value] }, {type: 'errorbar', data: [errorBarValues]}],
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
        pointPadding: 0.1
      }
    },
    tooltip: {
      hideDelay: 0,
    },
  };
  
  useEffect(() => {
    loadHighchartsModules(() => {
    setOptions(sparklineOptions);
    })
  }, [])

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
