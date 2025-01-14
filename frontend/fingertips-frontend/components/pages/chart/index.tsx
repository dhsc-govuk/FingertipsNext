'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { H3, BackLink, H2, H1 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateManager } from '@/lib/searchStateManager';
import { PopulationDataForArea } from '@/generated-sources/ft-api-client';

type ChartProps = {
  data: HealthDataForArea[];
  populationData: PopulationDataForArea[];
  indicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Area Code', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({
  data,
  populationData,
  indicator,
  indicatorsSelected = [],
}: Readonly<ChartProps>) {
  const searchState = new SearchStateManager({ indicator, indicatorsSelected });
  const backLinkPath = searchState.generatePath('/search/results');
  return (
    <>
      <BackLink data-testid="chart-page-back-link" href={backLinkPath} />
      <div>
        <H2>Mock population data</H2>
        <p>
          {populationData[0].areaName}({populationData[0].areaCode}) -{' '}
          {populationData[0].indicatorName}({populationData[0].indicatorId}){' '}
          {populationData[0].year}
        </p>
        <ul>
          {populationData[0].populationData.map((datapoint, index) => (
            <li key={index}>
              {datapoint.ageBand}: F{datapoint.totalFemale} M
              {datapoint.totalMale}
            </li>
          ))}
        </ul>
      </div>
      <H1>Line Chart</H1>
      <LineChart
        data={data}
        xAxisTitle="Year"
        accessibilityLabel="A line chart showing healthcare data"
      />
      <LineChartTable data={data} headings={headings}></LineChartTable>
    </>
  );
}
