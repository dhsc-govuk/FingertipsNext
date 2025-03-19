'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { BarChartEmbeddedTable } from '@/components/organisms/BarChartEmbeddedTable';
import { seriesDataWithoutEnglandOrGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { H2, H3, Paragraph } from 'govuk-react';
import { ViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { MapData } from '@/lib/thematicMapUtils/getMapData';
import { ThematicMap } from '@/components/organisms/ThematicMap';

const StyledParagraphDataSource = styled(Paragraph)(
  typography.font({ size: 16 })
);

interface OneIndicatorTwoOrMoreAreasViewPlotsProps extends ViewPlotProps {
  areaCodes: string[];
  mapData?: MapData;
}

export function OneIndicatorTwoOrMoreAreasViewPlots({
  healthIndicatorData,
  searchState,
  indicatorMetadata,
  mapData,
  areaCodes,
}: Readonly<OneIndicatorTwoOrMoreAreasViewPlotsProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    //  DHSCFT-483 to reinstate this
    // [SearchParams.GroupAreaSelected]: selectedGroupArea,
  } = stateManager.getSearchState();

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
    areaCodes &&
    areaCodes?.length <= 2;

  return (
    <section data-testid="oneIndicatorTwoOrMoreAreasViewPlots-component">
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
                    measurementUnit={indicatorMetadata?.unitLabel}
                    accessibilityLabel="A line chart showing healthcare data"
                  />
                ),
              },
              {
                id: 'lineChartTable',
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
        </>
      )}
      {
        // DHSCFT-483 to restore this to use only the selectedGroupArea flag
        // selectedGroupArea === 'ALL'
        selectedGroupCode && mapData && (
          <ThematicMap
            healthIndicatorData={healthIndicatorData}
            mapData={mapData}
          />
        )
      }
      <BarChartEmbeddedTable
        data-testid="barChartEmbeddedTable-component"
        healthIndicatorData={dataWithoutEngland}
        benchmarkData={englandBenchmarkData}
        groupIndicatorData={groupData}
        measurementUnit={indicatorMetadata?.unitLabel}
      ></BarChartEmbeddedTable>
    </section>
  );
}
