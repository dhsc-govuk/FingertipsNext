'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { seriesDataWithoutEnglandOrGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { H2, H3, Paragraph } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { ViewPlotProps } from '../ViewPlotProps';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramidWithTable } from '@/components/organisms/PopulationPyramidWithTable';

const StyledParagraphDataSource = styled(Paragraph)(
  typography.font({ size: 16 })
);

function shouldLineChartBeShown(
  dataWithoutEnglandOrGroup: HealthDataForArea[],
  englandBenchmarkData: HealthDataForArea | undefined
) {
  return (
    dataWithoutEnglandOrGroup[0]?.healthData.length > 1 ||
    (englandBenchmarkData && englandBenchmarkData.healthData.length > 1)
  );
}

interface OneIndicatorOneAreaViewPlotsProps extends ViewPlotProps {
  healthPopulationData?: HealthDataForArea[];
}

export function OneIndicatorOneAreaViewPlots({
  healthPopulationData,
  healthIndicatorData,
  searchState,
  indicatorMetadata,
}: Readonly<OneIndicatorOneAreaViewPlotsProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.GroupSelected]: selectedGroupCode } =
    stateManager.getSearchState();

  const dataWithoutEnglandOrGroup = seriesDataWithoutEnglandOrGroup(
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
      {shouldLineChartBeShown(
        dataWithoutEnglandOrGroup,
        englandBenchmarkData
      ) && (
        <>
          <H3>Indicator data over time</H3>
          <TabContainer
            id="lineChartAndTable"
            items={[
              {
                id: 'lineChart',
                title: 'Line chart',
                content: (
                  <LineChart
                    healthIndicatorData={dataWithoutEnglandOrGroup}
                    benchmarkData={englandBenchmarkData}
                    searchState={searchState}
                    groupIndicatorData={groupData}
                    xAxisTitle="Year"
                    yAxisTitle={
                      indicatorMetadata?.unitLabel
                        ? `Value: ${indicatorMetadata?.unitLabel}`
                        : undefined
                    }
                    measurementUnit={indicatorMetadata?.unitLabel}
                    accessibilityLabel="A line chart showing healthcare data"
                  />
                ),
              },
              {
                id: 'lineChartTable',
                title: 'Table',
                content: (
                  <LineChartTable
                    healthIndicatorData={dataWithoutEnglandOrGroup}
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

      <PopulationPyramidWithTable
        healthDataForAreas={healthPopulationData ?? []}
        selectedGroupAreaCode={selectedGroupCode}
        xAxisTitle="Age"
        yAxisTitle="Percentage"
      />
    </section>
  );
}
