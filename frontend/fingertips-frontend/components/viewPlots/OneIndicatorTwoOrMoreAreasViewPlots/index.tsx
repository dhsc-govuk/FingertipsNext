'use client';

import {
  determineAreasForBenchmarking,
  determineBenchmarkToUse,
  seriesDataWithoutEnglandOrGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams } from '@/lib/searchStateManager';
import { OneIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlot.types';
import { ThematicMap } from '@/components/organisms/ThematicMap';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client/models/BenchmarkComparisonMethod';
import { IndicatorPolarity } from '@/generated-sources/ft-api-client';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { LineChartAndTableOverTime } from '@/components/charts/LineChartOverTime/LineChartAndTableOverTime';
import { CompareAreasTable } from '@/components/charts/CompareAreasTable/CompareAreasTable';
import { compareAreasTableIsRequired } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableIsRequired';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { OneIndicatorSegmentationOptions } from '@/components/viewPlots/OneIndicatorSegmentationOptions';

interface OneIndicatorTwoOrMoreAreasViewPlotsProps
  extends OneIndicatorViewPlotProps {
  areaCodes?: string[];
  indicatorMetadata?: IndicatorDocument;
}

export function OneIndicatorTwoOrMoreAreasViewPlots({
  indicatorData,
  indicatorMetadata,
  areaCodes = [],
  session,
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
  const showCompareAreasTable = compareAreasTableIsRequired(searchState);

  return (
    <section data-testid="oneIndicatorTwoOrMoreAreasViewPlots-component">
      <BenchmarkSelectArea availableAreas={availableAreasForBenchmarking} />
      <OneIndicatorSegmentationOptions />
      {showLineChartOverTime ? (
        <LineChartAndTableOverTime session={session} />
      ) : null}
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
      {showCompareAreasTable ? <CompareAreasTable session={session} /> : null}
    </section>
  );
}
