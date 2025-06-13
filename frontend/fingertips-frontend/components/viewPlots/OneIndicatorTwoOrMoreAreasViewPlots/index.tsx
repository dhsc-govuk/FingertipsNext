'use client';

import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { BarChartEmbeddedTable } from '@/components/organisms/BarChartEmbeddedTable';
import {
  determineAreasForBenchmarking,
  determineBenchmarkToUse,
  seriesDataWithoutEnglandOrGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams } from '@/lib/searchStateManager';
import { H3 } from 'govuk-react';
import { OneIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlot.types';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client/models/BenchmarkComparisonMethod';
import { IndicatorPolarity } from '@/generated-sources/ft-api-client';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import {
  generateStandardLineChartOptions,
  LineChartVariant,
} from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

interface OneIndicatorTwoOrMoreAreasViewPlotsProps
  extends OneIndicatorViewPlotProps {
  areaCodes?: string[];
}

export function OneIndicatorTwoOrMoreAreasViewPlots({
  indicatorData,
  indicatorMetadata,
  areaCodes = [],
}: Readonly<OneIndicatorTwoOrMoreAreasViewPlotsProps>) {
  const searchState = useSearchStateParams();

  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
  } = searchState;

  const healthIndicatorData = indicatorData?.areaHealthData ?? [];

  const { benchmarkMethod, polarity } = indicatorData;

  const dataWithoutEnglandOrGroup = seriesDataWithoutEnglandOrGroup(
    healthIndicatorData,
    selectedGroupCode
  );

  const englandData = healthIndicatorData.find(
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

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    healthIndicatorData,
    selectedGroupCode,
    areasSelected,
    selectedGroupArea
  );

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  const yAxisTitle = indicatorMetadata?.unitLabel
    ? `Value: ${indicatorMetadata?.unitLabel}`
    : undefined;

  const lineChartOptions: Highcharts.Options = generateStandardLineChartOptions(
    dataWithoutEnglandOrGroup,
    true,
    benchmarkToUse,
    {
      indicatorName: indicatorData.name,
      englandData,
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
      <BenchmarkSelectArea
        availableAreas={availableAreasForBenchmarking}
        benchmarkAreaSelectedKey={SearchParams.BenchmarkAreaSelected}
      />
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
                    title={lineChartOptions.title?.text ?? ''}
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
                    title={lineChartOptions.title?.text ?? ''}
                    healthIndicatorData={dataWithoutEnglandOrGroup}
                    englandIndicatorData={englandData}
                    groupIndicatorData={groupData}
                    indicatorMetadata={indicatorMetadata}
                    benchmarkComparisonMethod={benchmarkMethod}
                    polarity={polarity}
                    benchmarkToUse={benchmarkToUse}
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
            healthIndicatorData={dataWithoutEnglandOrGroup}
            benchmarkComparisonMethod={
              benchmarkMethod ?? BenchmarkComparisonMethod.Unknown
            }
            polarity={polarity ?? IndicatorPolarity.Unknown}
            indicatorMetadata={indicatorMetadata}
            groupData={groupData}
            englandData={englandData}
            areaCodes={areaCodes ?? []}
            benchmarkToUse={benchmarkToUse}
          />
        </StyleChartWrapper>
      )}
      <StyleChartWrapper>
        <H3>Compare an indicator by areas</H3>
        <BarChartEmbeddedTable
          key={`barchart-${benchmarkToUse}`}
          data-testid="barChartEmbeddedTable-component"
          healthIndicatorData={dataWithoutEnglandOrGroup}
          englandData={englandData}
          groupIndicatorData={groupData}
          indicatorMetadata={indicatorMetadata}
          benchmarkComparisonMethod={benchmarkMethod}
          polarity={polarity}
          benchmarkToUse={benchmarkToUse}
        />
      </StyleChartWrapper>
    </section>
  );
}
