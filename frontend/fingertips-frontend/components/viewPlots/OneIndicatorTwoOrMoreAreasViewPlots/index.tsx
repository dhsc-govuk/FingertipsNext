'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { BarChartEmbeddedTable } from '@/components/organisms/BarChartEmbeddedTable';
import {
  determineBenchmarkToUse,
  seriesDataWithoutEnglandOrGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams } from '@/lib/searchStateManager';
import { H3 } from 'govuk-react';
import { OneIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlot.types';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { LineChartVariant } from '@/components/organisms/LineChart/helpers/lineChartHelpers';
import { useEffect } from 'react';
import { useSearchState } from '@/context/SearchStateContext';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client/models/BenchmarkComparisonMethod';
import {
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { generateStandardLineChartOptions } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';

interface OneIndicatorTwoOrMoreAreasViewPlotsProps
  extends OneIndicatorViewPlotProps {
  indicatorDataAllAreas?: IndicatorWithHealthDataForArea;
  areaCodes?: string[];
}

export function OneIndicatorTwoOrMoreAreasViewPlots({
  indicatorData,
  indicatorMetadata,
  searchState,
  indicatorDataAllAreas,
  areaCodes = [],
}: Readonly<OneIndicatorTwoOrMoreAreasViewPlotsProps>) {
  const { setSearchState } = useSearchState();

  useEffect(() => {
    setSearchState(searchState ?? {});
  }, [searchState, setSearchState]);

  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.LineChartAreaSelected]: lineChartAreaSelected,
  } = searchState;

  const healthIndicatorData = indicatorData?.areaHealthData ?? [];
  const healthIndicatorDataAllAreas =
    indicatorDataAllAreas?.areaHealthData ?? [];

  const { benchmarkMethod, polarity } = indicatorData;

  const dataWithoutEnglandOrGroup = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData,
    selectedGroupCode
  );
  const dataWithoutEnglandOrGroupAllAreas = seriesDataWithoutEnglandOrGroup(
    healthIndicatorDataAllAreas,
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
    (dataWithoutEnglandOrGroup[0]?.healthData.length > 1 ||
      benchmarkMethod === BenchmarkComparisonMethod.Quintiles) &&
    areasSelected &&
    areasSelected?.length <= 2;

  const benchmarkToUse = determineBenchmarkToUse(lineChartAreaSelected);

  const yAxisTitle = indicatorMetadata?.unitLabel
    ? `Value: ${indicatorMetadata?.unitLabel}`
    : undefined;

  const lineChartOptions: Highcharts.Options = generateStandardLineChartOptions(
    dataWithoutEnglandOrGroup,
    true,
    benchmarkToUse,
    {
      englandData: englandBenchmarkData,
      benchmarkComparisonMethod: indicatorData.benchmarkMethod,
      groupIndicatorData: groupData,
      yAxisTitle,
      xAxisTitle: 'Period',
      measurementUnit: indicatorMetadata?.unitLabel,
      accessibilityLabel: 'A line chart showing healthcare data',
    }
  );

  return (
    <section data-testid="oneIndicatorTwoOrMoreAreasViewPlots-component">
      {shouldLineChartbeShown && (
        <StyleChartWrapper>
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
            footer={<DataSource dataSource={indicatorMetadata?.dataSource} />}
          />
        </StyleChartWrapper>
      )}
      {selectedGroupArea === ALL_AREAS_SELECTED && (
        <StyleChartWrapper>
          <ThematicMap
            selectedAreaType={selectedAreaType}
            healthIndicatorData={dataWithoutEnglandOrGroupAllAreas}
            benchmarkComparisonMethod={
              benchmarkMethod ?? BenchmarkComparisonMethod.Unknown
            }
            polarity={polarity ?? IndicatorPolarity.Unknown}
            indicatorMetadata={indicatorMetadata}
            benchmarkIndicatorData={englandBenchmarkData}
            groupIndicatorData={groupData}
            areaCodes={areaCodes ?? []}
          />
        </StyleChartWrapper>
      )}
      <StyleChartWrapper>
        <H3>Compare an indicator by areas</H3>
        <BarChartEmbeddedTable
          data-testid="barChartEmbeddedTable-component"
          healthIndicatorData={dataWithoutEnglandOrGroup}
          benchmarkData={englandBenchmarkData}
          groupIndicatorData={groupData}
          measurementUnit={indicatorMetadata?.unitLabel}
          benchmarkComparisonMethod={benchmarkMethod}
          polarity={polarity}
          dataSource={indicatorMetadata?.dataSource}
        />
      </StyleChartWrapper>
    </section>
  );
}
