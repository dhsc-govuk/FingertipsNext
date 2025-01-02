'use client';

import { LineChart } from '@/components/organisms/linechartsOptions';
import { WeatherForecast } from '@/generated-sources/api-client';
import { BackLink, H1 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';

type ChartProps = {
  data: WeatherForecast[];
  indicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Date', 'TemperatureC', 'TemperatureF', 'Summary'];

export function Chart({
  data,
  indicator,
  indicatorsSelected = [],
}: Readonly<ChartProps>) {
  return (
    <>
      <BackLink
        data-testid="chart-page-back-link"
        href={`/search/results?indicator=${indicator}&indicatorsSelected=${encodeURIComponent(indicatorsSelected?.join(','))}`}
      />
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
