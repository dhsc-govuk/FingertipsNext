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
import {
  getEnglandDataForIndicatorIndex,
  seriesDataWithoutEngland,
} from '@/lib/chartHelpers/chartHelpers';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { MapData } from '@/lib/thematicMapUtils/getMapData';
import { shouldDisplayLineChart } from '@/components/organisms/LineChart/lineChartHelpers';

type ChartProps = {
  data: HealthDataForArea[][];
  mapData?: MapData;
  populationData?: PopulationData;
  searchedIndicator?: string;
  indicatorsSelected?: string[];
  areasSelected?: string[];
};

export function Chart({
  data,
  mapData,
  populationData,
  searchedIndicator,
  indicatorsSelected = [],
  areasSelected = [],
}: Readonly<ChartProps>) {
  const searchState = new SearchStateManager({
    [SearchParams.SearchedIndicator]: searchedIndicator,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  });

  const backLinkPath = searchState.generatePath('/results');

  const englandBenchmarkData = getEnglandDataForIndicatorIndex(data, 0);
  const dataWithoutEngland = seriesDataWithoutEngland(data[0]);

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
            data={dataWithoutEngland}
            benchmarkData={englandBenchmarkData}
            xAxisTitle="Year"
            accessibilityLabel="A line chart showing healthcare data"
          />
          <LineChartTable
            data={dataWithoutEngland}
            englandBenchmarkData={englandBenchmarkData}
          />
        </>
      )}
      <br />
      {indicatorsSelected.length == 2 ? (
        <>
          <ScatterChart
            data={data}
            ScatterChartTitle="Compare indicators within the area group"
            yAxisTitle="y: Indicator 1 (value)"
            yAxisSubtitle="rate per information"
            xAxisTitle="x: Indicator 2 (value)"
            xAxisSubtitle="rate per information"
            accessibilityLabel="A scatter chart showing two indicators"
          ></ScatterChart>
          <br />
        </>
      ) : null}
      <BarChart
        data={data[0]}
        yAxisTitle="Value"
        benchmarkLabel="England"
        benchmarkValue={800}
        accessibilityLabel="A bar chart showing healthcare data"
      />
      {populationData ? (
        <>
          <br />
          <PopulationPyramid
            data={populationData}
            populationPyramidTitle="Population INDICATOR for SELECTED area"
            xAxisTitle="Age"
            yAxisTitle="Percentage of total population"
            accessibilityLabel="A pyramid chart showing population data for SELECTED AREA"
          />
        </>
      ) : null}
      {data.length === 1 && mapData ? (
        <>
          <ThematicMap
            data={data[0]}
            mapData={mapData}
            mapTitle="Compare indicator data within the area group"
          />
          <br />
        </>
      ) : null}
    </>
  );
}
