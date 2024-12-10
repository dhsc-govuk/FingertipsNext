'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import type { Options } from 'highcharts';

const options: Options = {
  title: {
    text: undefined,
  },
  legend: {
    verticalAlign: 'top',
  },
  xAxis: {
    categories: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
    ],
  },
  yAxis: {
    title: {
      text: undefined,
    },
  },
  series: [
    {
      name: 'A thing that happened',
      // We're using a spline chart as it gives us the curved lines like Chart.js'
      type: 'spline',
      data: [65, 59, 80, 81, 56, 55, 40],
      color: 'rgb(75, 192, 192)',
    },
  ],
};

export default function LineChart() {
  return (
    <>
      <h2>Line Chart</h2>
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </>
  );
}
