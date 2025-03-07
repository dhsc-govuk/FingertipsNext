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
import { H2, H3, Paragraph } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';

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
  const StyledParagraphDataSource = styled(Paragraph)(
    typography.font({ size: 16 })
  );

  const stateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.GroupSelected]: selectedGroupCode } =
    stateManager.getSearchState();

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
                    yAxisTitle={
                      indicatorMetadata?.unitLabel
                        ? `Value: ${indicatorMetadata?.unitLabel}`
                        : ''
                    }
                    measurementUnit={indicatorMetadata?.unitLabel ?? ''}
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
                    measurementUnit={indicatorMetadata?.unitLabel}
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
    </section>
  );
}
