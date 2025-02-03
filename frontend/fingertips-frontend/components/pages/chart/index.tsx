'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { BackLink, H2 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchStateManager } from '@/lib/searchStateManager';
import { BarChart } from '@/components/organisms/BarChart';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { GeoJSON, GeoJSONFeature } from 'highcharts';

// using mock to spike maps
import { mockHealthData } from '@/mock/data/healthdata';

type ChartProps = {
  data: HealthDataForArea[];
  mapData: GeoJSON;
  mapJoinKey: string;
  mapZoom: GeoJSONFeature;
  populationData?: PopulationData;
  searchedIndicator?: string;
  indicatorsSelected?: string[];
};

const headings = ['Area', 'Year', 'Value', 'Count', 'LowerCi', 'UpperCi'];

export function Chart({
  data,
  mapData,
  mapJoinKey,
  mapZoom,
  populationData,
  searchedIndicator,
  indicatorsSelected = [],
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
      <ThematicMap
        data={mockHealthData['Mock 318 for West Midlands CA']}
        mapData={mapData}
        mapJoinKey={mapJoinKey}
        mapZoom={mapZoom}
      />

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
