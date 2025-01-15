'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { H3, BackLink } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateManager } from '@/lib/searchStateManager';
import { BarChart } from '@/components/organisms/BarChart';

type ChartProps = {
  data: HealthDataForArea[];
  indicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Area Code', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({
  data,
  indicator,
  indicatorsSelected = [],
}: Readonly<ChartProps>) {
  const searchState = new SearchStateManager({ indicator, indicatorsSelected });
  const backLinkPath = searchState.generatePath('/search/results');
  return (
    <>
      <BackLink data-testid="chart-page-back-link" href={backLinkPath} />
      <H3>See how the indicator has changed over time for the area</H3>
      <LineChart
        data={data}
        xAxisTitle="Year"
        accessibilityLabel="A line chart showing healthcare data"
      />
      <BarChart data={data} yAxisTitle="Value" benchmarkLabel="England" />
      <br />
      <LineChartTable data={data} headings={headings}></LineChartTable>
    </>
  );
}
