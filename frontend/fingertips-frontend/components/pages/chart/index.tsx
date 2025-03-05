'use client';

import { LineChart } from '@/components/organisms/LineChart';
import { BackLink, H2, H3, Paragraph } from 'govuk-react';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { BarChart } from '@/components/organisms/BarChart';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';
import {
  isEnglandSoleSelectedArea,
  seriesDataForIndicatorIndexAndArea,
  seriesDataWithoutEnglandOrGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { MapData } from '@/lib/thematicMapUtils/getMapData';
import { shouldDisplayLineChart } from '@/components/organisms/LineChart/lineChartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { TabContainer } from '@/components/layouts/tabContainer';
import { shouldDisplayInequalities } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { Inequalities } from '@/components/organisms/Inequalities';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';

type ChartProps = {
  healthIndicatorData: HealthDataForArea[][];
  mapData?: MapData;
  populationData?: PopulationData;
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument;
};

const StyledParagraphDataSource = styled(Paragraph)(
  typography.font({ size: 16 })
);

export function Chart({
  healthIndicatorData,
  mapData,
  populationData,
  searchState,
  indicatorMetadata,
}: Readonly<ChartProps>) {
  const stateManager = SearchStateManager.initialise(searchState);

  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  const backLinkPath = stateManager.generatePath('/results');

  const englandBenchmarkData = seriesDataForIndicatorIndexAndArea(
    healthIndicatorData,
    0,
    areaCodeForEngland
  );

  const dataWithoutEngland = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData[0],
    selectedGroupCode
  );

  const groupData =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? seriesDataForIndicatorIndexAndArea(
          healthIndicatorData,
          0,
          selectedGroupCode
        )
      : undefined;

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
          <H3>See how the indicator has changed over time</H3>
          <TabContainer
            id="lineChartAndTable"
            items={[
              {
                id: 'lineChart',
                title: 'Line chart',
                content: (
                  <LineChart
                    healthIndicatorData={dataWithoutEngland}
                    benchmarkData={englandBenchmarkData}
                    searchState={searchState}
                    groupIndicatorData={groupData}
                    xAxisTitle="Year"
                    accessibilityLabel="A line chart showing healthcare data"
                  />
                ),
              },
              {
                id: 'table',
                title: 'Table',
                content: (
                  <LineChartTable
                    healthIndicatorData={dataWithoutEngland}
                    englandBenchmarkData={englandBenchmarkData}
                    groupIndicatorData={groupData}
                  />
                ),
              },
            ]}
            footer={
              <>
                {indicatorsSelected?.length === 1 && indicatorMetadata ? (
                  <StyledParagraphDataSource>
                    {`Data source: ${indicatorMetadata.dataSource}`}
                  </StyledParagraphDataSource>
                ) : null}
              </>
            }
          />
        </>
      )}
      <br />
      {shouldDisplayInequalities(indicatorsSelected, areasSelected) && (
        <Inequalities
          healthIndicatorData={
            !isEnglandSoleSelectedArea(searchState[SearchParams.AreasSelected])
              ? dataWithoutEngland[0]
              : healthIndicatorData[0][0]
          }
          areasSelected={searchState[SearchParams.AreasSelected]}
        />
      )}
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
