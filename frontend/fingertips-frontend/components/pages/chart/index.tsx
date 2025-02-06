'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { BackLink, H2 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { BarChart } from '@/components/organisms/BarChart';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { ScatterChart } from '@/components/organisms/ScatterChart';
import { getEnglandDataForIndicatorIndex } from '@/lib/chartHelpers/chartHelpers';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { GeoJSON } from 'highcharts';

// using mock to spike maps
import { mockHealthData } from '@/mock/data/healthdata';

type ChartProps = {
  data: HealthDataForArea[][];
  mapData?: GeoJSON;
  mapJoinKey?: string;
  mapGroup?: GeoJSON;
  populationData?: PopulationData;
  searchedIndicator?: string;
  indicatorsSelected?: string[];
};

export function Chart({
  data,
  mapData,
  mapJoinKey,
  mapGroup,
  populationData,
  searchedIndicator,
  indicatorsSelected = [],
}: Readonly<ChartProps>) {
  const searchState = new SearchStateManager({
    [SearchParams.SearchedIndicator]: searchedIndicator,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  });
  const backLinkPath = searchState.generatePath('/results');

  const englandBenchmarkData = getEnglandDataForIndicatorIndex(data, 0);

  return (
    <>
      <BackLink
        data-testid="chart-page-back-link"
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <H2>View Dementia QOF prevalence</H2>
      {/* TODO: apply correct business logic for conditional render */}
      {mapData && mapJoinKey && mapGroup ? (
        <ThematicMap
          data={mockHealthData['Mock 318 for West Midlands CA']}
          mapData={mapData}
          mapJoinKey={mapJoinKey}
          mapGroup={mapGroup}
          mapTitle="Compare indicators within the area group"
        />
      ) : null}
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
      {indicatorsSelected.length == 2 ? (
        <ScatterChart
          data={data}
          ScatterChartTitle="Compare indicators within the area group"
          yAxisTitle="y: Indicator 1 (value)"
          yAxisSubtitle="rate per information"
          xAxisTitle="x: Indicator 2 (value)"
          xAxisSubtitle="rate per information"
          accessibilityLabel="A scatter chart showing two indicators"
        ></ScatterChart>
      ) : null}
      <LineChart
        LineChartTitle="Line chart to show how the indicator has changed over time for the area"
        data={data[0]}
        xAxisTitle="Year"
        accessibilityLabel="A line chart showing healthcare data"
      />
      <br />
      <BarChart
        data={data[0]}
        yAxisTitle="Value"
        benchmarkLabel="England"
        benchmarkValue={800}
        accessibilityLabel="A bar chart showing healthcare data"
      />
      <br />
      <LineChartTable
        data={data[0][0]}
        englandBenchmarkData={englandBenchmarkData}
      ></LineChartTable>
    </>
  );
}
