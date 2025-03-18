'use client';

import { HighchartsReact } from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface SparklineChartProps {
  value: number | undefined;
  maxValue?: number;
}
export function SparklineChart({
  value,
  maxValue,
}: Readonly<SparklineChartProps>) {
  const sparklineOptions = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'bar',
      height: 60,
      width: 200,
      backgroundColor: 'transparent',
      padding: '50',
    },
    title: {
      style: {
        display: 'none',
      },
    },
    yAxis: { visible: false, min: 0 },
    xAxis: { visible: false },
    series: [{ type: 'bar', data: [value] }],
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
    },
    tooltip: {
      hideDelay: 0,
    },
  };

  return (
    <HighchartsReact
      containerProps={{
        'data-testid': 'highcharts-react-component-barChartEmbeddedTable',
      }}
      highcharts={Highcharts}
      options={sparklineOptions}
    ></HighchartsReact>
  );
}
