'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { H3, BackLink } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateManager } from '@/lib/searchStateManager';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PreparedPopulationData } from '@/app/chart/page';

type ChartProps = {
  data: HealthDataForArea[];
  preparedPopulationData: PreparedPopulationData;
  indicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Area Code', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({
  data,
  preparedPopulationData,
  indicator,
  indicatorsSelected = [],
}: Readonly<ChartProps>) {
  const searchState = new SearchStateManager({ indicator, indicatorsSelected });
  const backLinkPath = searchState.generatePath('/search/results');
  return (
    <>
      <BackLink data-testid="chart-page-back-link" href={backLinkPath} />
      <H3>Title for the chart page</H3>
      {/* TODO: Business logic for which chart to render */}
      <PopulationPyramid
        data={preparedPopulationData}
        populationPyramidTitle="Population MEASURE for SELECTED area"
        xAxisTitle="Age"
        yAxisTitle="Percentage of total population"
        accessibilityLabel="A pyramid chart showing population data for SELECTED AREA"
      />
      <LineChart
        LineChartTitle="Line chart to show how the indicator has changed over time for the area"
        data={data}
        xAxisTitle="Year"
        accessibilityLabel="A line chart showing healthcare data"
      />
      <LineChartTable data={data} headings={headings}></LineChartTable>
    </>
  );
}
