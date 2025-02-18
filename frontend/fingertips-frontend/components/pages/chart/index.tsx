'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { BackLink, H2 } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { BarChart } from '@/components/organisms/BarChart';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import {
  seriesDataForIndicatorIndexAndArea,
  seriesDataWithoutEnglandOrParent,
} from '@/lib/chartHelpers/chartHelpers';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { MapData } from '@/lib/thematicMapUtils/getMapData';
import { shouldDisplayLineChart } from '@/components/organisms/LineChart/lineChartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

type ChartProps = {
  healthIndicatorData: HealthDataForArea[][];
  parentAreaCode?: string;
  mapData?: MapData;
  populationData?: PopulationData;
  searchedIndicator?: string;
  indicatorsSelected?: string[];
  areasSelected?: string[];
};

export function Chart({
  healthIndicatorData,
  parentAreaCode,
  mapData,
  populationData,
  searchedIndicator,
  indicatorsSelected = [],
  areasSelected = [],
}: Readonly<ChartProps>) {
  const searchState = SearchStateManager.initialise({
    [SearchParams.SearchedIndicator]: searchedIndicator,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  });

  const backLinkPath = searchState.generatePath('/results');

  const englandBenchmarkData = seriesDataForIndicatorIndexAndArea(
    healthIndicatorData,
    0,
    areaCodeForEngland
  );
  const dataWithoutEngland = seriesDataWithoutEnglandOrParent(
    healthIndicatorData[0],
    parentAreaCode
  );

  let parentBenchmarkData: HealthDataForArea | undefined;
  if (parentAreaCode) {
    parentBenchmarkData = seriesDataForIndicatorIndexAndArea(
      healthIndicatorData,
      0,
      parentAreaCode
    );
  }

  return (
    <>
      <BackLink
        data-testid="chart-page-back-link"
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <H2>View data for selected indicators and areas</H2>
      {shouldDisplayLineChart(
        dataWithoutEngland,
        indicatorsSelected,
        areasSelected
      ) && (
        <>
          <LineChart
            LineChartTitle="See how the indicator has changed over time"
            healthIndicatorData={dataWithoutEngland}
            benchmarkData={englandBenchmarkData}
            xAxisTitle="Year"
            accessibilityLabel="A line chart showing healthcare data"
          />
          <LineChartTable
            healthIndicatorData={dataWithoutEngland}
            englandBenchmarkData={englandBenchmarkData}
            parentIndicatorData={parentBenchmarkData}
          />
        </>
      )}
      <br />
      <BarChart
        healthIndicatorData={healthIndicatorData[0]}
        yAxisTitle="Value"
        benchmarkLabel="England"
        benchmarkValue={800}
        accessibilityLabel="A bar chart showing healthcare data"
      />
      {populationData ? (
        <>
          <br />
          <PopulationPyramid
            healthIndicatorData={populationData}
            populationPyramidTitle="Population INDICATOR for SELECTED area"
            xAxisTitle="Age"
            yAxisTitle="Percentage of total population"
            accessibilityLabel="A pyramid chart showing population data for SELECTED AREA"
          />
        </>
      ) : null}
      {healthIndicatorData.length === 1 && mapData ? (
        <>
          <ThematicMap
            healthIndicatorData={healthIndicatorData[0]}
            mapData={mapData}
            mapTitle="Compare indicator data within the area group"
          />
          <br />
        </>
      ) : null}
    </>
  );
}
