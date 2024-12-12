'use client';

import { H1 } from 'govuk-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import Accessibility from 'highcharts/modules/accessibility.js';

interface Response {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface DataProp {
  data: Response[];
}

if (typeof Highcharts !== 'object') {
  Accessibility(Highcharts);
}

export function LineChart({ data }: DataProp) {
  const categories = data.map((item) => item.date);
  const temperatureData = data.map((item) => item.temperatureC);

  const lineChartOptions: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: 'Weather Forecast' },
    xAxis: { categories: categories, title: { text: 'Date' } },
    yAxis: {
      title: { text: 'Temperature (°C)' },
    },
    series: [
      {
        type: 'line',
        name: 'Temperature (°C)',
        data: temperatureData,
      },
    ],
    accessibility: {
      enabled: true,
      description: 'A line chart showing temperature data over 6 months.',
    },
  };
  return (
    <>
      <H1>Line Chart</H1>
      <div>
        <HighchartsReact
          containerProps={{ 'data-testid': 'highcharts-react-component' }}
          highcharts={Highcharts}
          options={lineChartOptions}
        />
      </div>
    </>
  );
}
