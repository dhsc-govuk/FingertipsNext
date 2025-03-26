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
import { MapData } from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import {
  generateStandardLineChartOptions,
  LineChartVariant,
} from '@/components/organisms/LineChart/lineChartHelpers';
import { useState } from 'react';

const StyledParagraphDataSource = styled(Paragraph)(
  typography.font({ size: 16 })
);

interface OneIndicatorTwoOrMoreAreasViewPlotsProps extends ViewPlotProps {
  mapData?: MapData;
}

export function OneIndicatorTwoOrMoreAreasViewPlots({
  healthIndicatorData,
  searchState,
  indicatorMetadata,
  mapData,
}: Readonly<OneIndicatorTwoOrMoreAreasViewPlotsProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
    [SearchParams.AreasSelected]: areasSelected,
  } = stateManager.getSearchState();
  const [showConfidenceIntervalsData, setShowConfidenceIntervalsData] =
    useState<boolean>(false);

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

  const shouldLineChartbeShown =
    dataWithoutEnglandOrGroup[0]?.healthData.length > 1 &&
    areasSelected &&
    areasSelected?.length <= 2;

  const yAxisTitle = indicatorMetadata?.unitLabel
    ? `Value: ${indicatorMetadata?.unitLabel}`
    : undefined;

  const lineChartOptions: Highcharts.Options = generateStandardLineChartOptions(
    dataWithoutEnglandOrGroup,
    showConfidenceIntervalsData,
    {
      benchmarkData: englandBenchmarkData,
      groupIndicatorData: groupData,
      yAxisTitle,
      xAxisTitle: 'Year',
      measurementUnit: indicatorMetadata?.unitLabel,
      accessibilityLabel: 'A line chart showing healthcare data',
    }
  );

  return (
    <section data-testid="oneIndicatorTwoOrMoreAreasViewPlots-component">
      <H2>View data for selected indicators and areas</H2>
      {shouldLineChartbeShown && (
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
                    lineChartOptions={lineChartOptions}
                    showConfidenceIntervalsData={showConfidenceIntervalsData}
                    setShowConfidenceIntervalsData={
                      setShowConfidenceIntervalsData
                    }
                    variant={LineChartVariant.Standard}
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
      <H3>Compare an indicator by areas</H3>
      {selectedGroupArea === ALL_AREAS_SELECTED && mapData && (
        <ThematicMap
          healthIndicatorData={dataWithoutEnglandOrGroup}
          mapData={mapData}
        />
      )}
      <BarChartEmbeddedTable
        data-testid="barChartEmbeddedTable-component"
        healthIndicatorData={dataWithoutEnglandOrGroup}
        benchmarkData={englandBenchmarkData}
        groupIndicatorData={groupData}
        measurementUnit={indicatorMetadata?.unitLabel}
      ></BarChartEmbeddedTable>
    </section>
  );
}
