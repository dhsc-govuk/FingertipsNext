'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { BarChartEmbeddedTable } from '@/components/organisms/BarChartEmbeddedTable';
import { seriesDataWithoutEnglandOrGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { BackLink, H2, H3, Paragraph } from 'govuk-react';
import { ViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';

const StyledParagraphDataSource = styled(Paragraph)(
  typography.font({ size: 16 })
);

export function OneIndicatorTwoOrMoreAreasViewPlots({
  healthIndicatorData,
  searchState,
  indicatorMetadata,
}: Readonly<ViewPlotProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();
  const backLinkPath = stateManager.generatePath('/results');

  const dataWithoutEngland = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData,
    selectedGroupCode
  );
  const englandBenchmarkData = healthIndicatorData.find(
    (areaData) => areaData.areaCode === areaCodeForEngland
  );

  const groupData =
    selectedGroupCode && selectedGroupCode != areaCodeForEngland
      ? healthIndicatorData.find(
          (areaData) => areaData.areaCode === selectedGroupCode
        )
      : undefined;

  const shouldLineChartbeShown =
    dataWithoutEngland[0]?.healthData.length > 1 &&
    areasSelected &&
    areasSelected?.length <= 2;

  return (
    <section data-testid="oneIndicatorTwoOrMoreAreasViewPlots-component">
      <BackLink
        data-testid="chart-page-back-link"
        href={backLinkPath}
        aria-label="Go back to the previous page"
      />
      <H2>View data for selected indicators and areas</H2>
      {shouldLineChartbeShown && (
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
                title: 'Tabular data',
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
                {indicatorMetadata ? (
                  <StyledParagraphDataSource>
                    {`Data source: ${indicatorMetadata.dataSource}`}
                  </StyledParagraphDataSource>
                ) : null}
              </>
            }
          />
          <BarChartEmbeddedTable
            healthIndicatorData={dataWithoutEngland}
            benchmarkData={englandBenchmarkData}
            groupIndicatorData={groupData}
          ></BarChartEmbeddedTable>
        </>
      )}
    </section>
  );
}
