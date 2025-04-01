'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { BarChartEmbeddedTable } from '@/components/organisms/BarChartEmbeddedTable';
import { seriesDataWithoutEnglandOrGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { H3, Paragraph } from 'govuk-react';
import { OneIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlotProps';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import {
  AreaTypeKeysForMapMeta,
  MapGeographyData,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import {
  generateStandardLineChartOptions,
  LineChartVariant,
} from '@/components/organisms/LineChart/lineChartHelpers';
import { useState, useEffect } from 'react';
import { useSearchState } from '@/context/SearchStateContext';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client/models/BenchmarkComparisonMethod';
import {
  IndicatorPolarity,
  JSONApiResponse,
} from '@/generated-sources/ft-api-client';

const StyledParagraphDataSource = styled(Paragraph)(
  typography.font({ size: 16 })
);

interface OneIndicatorTwoOrMoreAreasViewPlotsProps
  extends OneIndicatorViewPlotProps {
  mapGeographyData?: MapGeographyData;
}

export function OneIndicatorTwoOrMoreAreasViewPlots({
  indicatorData,
  indicatorMetadata,
  searchState,
  mapGeographyData,
}: Readonly<OneIndicatorTwoOrMoreAreasViewPlotsProps>) {
  const { setSearchState } = useSearchState();

  useEffect(() => {
    setSearchState(searchState ?? {});
  }, [searchState, setSearchState]);

  const stateManager = SearchStateManager.initialise(searchState);

  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
    [SearchParams.AreasSelected]: areasSelected,
  } = stateManager.getSearchState();
  const healthIndicatorData = indicatorData?.areaHealthData ?? [];
  const { benchmarkMethod, polarity } = indicatorData;
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
    selectedGroupCode && selectedGroupCode !== areaCodeForEngland
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
                    benchmarkComparisonMethod={benchmarkMethod}
                    polarity={polarity}
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
      {selectedGroupArea === ALL_AREAS_SELECTED && mapGeographyData && (
        <ThematicMap
          healthIndicatorData={dataWithoutEnglandOrGroup}
          mapGeographyData={mapGeographyData}
          benchmarkComparisonMethod={
            benchmarkMethod ?? BenchmarkComparisonMethod.Unknown
          }
          polarity={polarity ?? IndicatorPolarity.Unknown}
          measurementUnit={indicatorMetadata?.unitLabel}
          benchmarkIndicatorData={englandBenchmarkData}
          groupIndicatorData={groupData}
        />
      )}
      <BarChartEmbeddedTable
        data-testid="barChartEmbeddedTable-component"
        healthIndicatorData={dataWithoutEnglandOrGroup}
        benchmarkData={englandBenchmarkData}
        groupIndicatorData={groupData}
        measurementUnit={indicatorMetadata?.unitLabel}
        benchmarkComparisonMethod={benchmarkMethod}
        polarity={polarity}
      ></BarChartEmbeddedTable>
    </section>
  );
}
