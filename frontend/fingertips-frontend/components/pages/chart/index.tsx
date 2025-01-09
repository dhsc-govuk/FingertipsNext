'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { WeatherForecast } from '@/generated-sources/api-client';
import { BackLink, H1 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { SearchStateManager } from '@/lib/searchStateManager';

type ChartProps = {
  data: WeatherForecast[];
  searchedIndicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Date', 'TemperatureC', 'TemperatureF', 'Summary'];

export function Chart({
  data,
  searchedIndicator,
  indicatorsSelected = [],
}: Readonly<ChartProps>) {
  const searchState = new SearchStateManager({
    searchedIndicator,
    indicatorsSelected,
  });
  const backLinkPath = searchState.generatePath('/search/results');

  return (
    <>
      <BackLink data-testid="chart-page-back-link" href={backLinkPath} />
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
