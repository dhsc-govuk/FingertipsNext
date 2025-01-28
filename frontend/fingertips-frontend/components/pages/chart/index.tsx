'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { BackLink, H2 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateManager } from '@/lib/searchStateManager';
import { BarChart } from '@/components/organisms/BarChart';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { ScatterChart } from '@/components/organisms/ScatterChart';

type ChartProps = {
  data: HealthDataForArea[];
  populationData?: PopulationData;
  searchedIndicator?: string;
  indicatorsSelected?: string[];
  scatterData?: HealthDataForArea[][];
};

const headings = ['Area', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({
  data,
  populationData,
  searchedIndicator,
  indicatorsSelected = [],
  scatterData,
}: Readonly<ChartProps>) {
  const searchState = new SearchStateManager({
    searchedIndicator,
    indicatorsSelected,
  });
  const backLinkPath = searchState.generatePath('/results');
  return (
    <>
      <BackLink
        data-testid="chart-page-back-link"
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <H2>View Dementia QOF prevalence</H2>
      {populationData ? (
        <>
          <PopulationPyramid
            data={populationData}
            populationPyramidTitle="Population INDICATOR for SELECTED area"
            xAxisTitle="Age"
            yAxisTitle="Percentage of total population"
            accessibilityLabel="A pyramid chart showing population data for SELECTED AREA"
          />
          <br />
        </>
      ) : null}
      {scatterData ? (
        <ScatterChart
          data={scatterData}
          ScatterChartTitle="Compare indicators within the area group"
          yAxisTitle="<b>y: Indicator 1 (value)</b></br> rate per information"
          xAxisTitle="<b>x: Indicator 2 (value)</b></br> rate per information"
          accessibilityLabel="A scatter chart showing two indicators"
        ></ScatterChart>
      ) : null}
      <LineChart
        LineChartTitle="Line chart to show how the indicator has changed over time for the area"
        data={data}
        xAxisTitle="Year"
        accessibilityLabel="A line chart showing healthcare data"
      />
      <br />
      <BarChart
        data={data}
        yAxisTitle="Value"
        benchmarkLabel="England"
        benchmarkValue={800}
        accessibilityLabel="A bar chart showing healthcare data"
      />
      <br />
      <LineChartTable data={data} headings={headings}></LineChartTable>
    </>
  );
}
