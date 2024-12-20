'use client';

import { LineChart } from '@/components/organisms/linechartsOptions';
import { WeatherForecast } from '@/generated-sources/api-client';
import { H1 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/lineChartTable';

type ChartProps = {
  data: WeatherForecast[];
};

const headings = ['Date', 'TemperatureC', 'TemperatureF', 'Summary'];

export function Chart({ data }: Readonly<ChartProps>) {
  return (
    <>
      <H1>Line Chart</H1>
      <LineChart
        data={data}
        title="Weather Forecast"
        xAxisTitle="Date"
        yAxisTitle="Temperature (°C)"
        accessibilityLabel="A line chart showing weather forecast"
      />
      <LineChartTable data={data} headings={headings}></LineChartTable>
    </>
  );
}
