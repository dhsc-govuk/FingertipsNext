'use client';

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
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { LineChartAndTableOverTime } from '@/components/charts/LineChartOverTime/LineChartAndTableOverTime';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';

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

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    healthIndicatorData,
    selectedGroupCode,
    areasSelected,
    selectedGroupArea
  );

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);
  const showLineChartOverTime = lineChartOverTimeIsRequired(searchState);

  return (
    <section data-testid="oneIndicatorTwoOrMoreAreasViewPlots-component">
      <BenchmarkSelectArea
        availableAreas={availableAreasForBenchmarking}
        benchmarkAreaSelectedKey={SearchParams.BenchmarkAreaSelected}
      />
      {showLineChartOverTime ? <LineChartAndTableOverTime /> : null}
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
