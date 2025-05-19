import { useRef } from 'react';
import { Chart } from 'highcharts';

export const useHighChartsCallback = () => {
  const chartRef = useRef<Chart | undefined>(undefined);
  const callback = (chart: Chart) => {
    chartRef.current = chart;
  };
  return { chartRef, callback };
};
