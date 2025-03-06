'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { seriesDataWithoutEnglandOrGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { H2, H3 } from 'govuk-react';

type OneIndicatorOneAreaViewProps = {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument;
};

export function OneIndicatorOneAreaViewPlots({
  healthIndicatorData,
  searchState,
  indicatorMetadata,
}: Readonly<OneIndicatorOneAreaViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
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
  return (
    <section data-testid="oneIndicatorOneAreaViewPlot-component">
      <H2>View data for selected indicators and areas</H2>
      {dataWithoutEngland[0]?.healthData.length > 1 && (
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
                {indicatorsSelected?.length === 1 && indicatorMetadata ? (
                  // <StyledParagraphDataSource>
                  // {`Data source: ${indicatorMetadata.dataSource}`}
                  <p> {`Data source: ${indicatorMetadata.dataSource}`}</p>
                ) : // </StyledParagraphDataSource>
                null}
              </>
            }
          />
        </>
      )}
    </section>
  );
}
