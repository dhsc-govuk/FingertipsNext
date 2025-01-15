'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { H3, BackLink } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateManager } from '@/lib/searchStateManager';
import { useSearchParams } from 'next/navigation';

type ChartProps = {
  data: HealthDataForArea[];
  searchedIndicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Area Code', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({
  data,
  searchedIndicator,
  indicatorsSelected = [],
}: Readonly<ChartProps>) {
  const searchParams = useSearchParams();
  const existingParams = new URLSearchParams(searchParams);
  const searchStateManager =
    SearchStateManager.setStateFromParams(existingParams);

  const backLinkPath = searchStateManager.generatePath('/search/results');
  return (
    <>
      <BackLink data-testid="chart-page-back-link" href={backLinkPath} />
      <H3>See how the indicator has changed over time for the area</H3>
      <LineChart
        data={data}
        xAxisTitle="Year"
        accessibilityLabel="A line chart showing healthcare data"
      />
      <LineChartTable data={data} headings={headings}></LineChartTable>
    </>
  );
}
