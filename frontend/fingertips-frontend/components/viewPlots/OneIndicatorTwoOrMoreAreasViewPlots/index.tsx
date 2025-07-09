'use client';

import { determineAreasForBenchmarking } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams } from '@/lib/searchStateManager';
import { OneIndicatorViewPlotProps } from '@/components/viewPlots/ViewPlot.types';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { BenchmarkSelectArea } from '@/components/molecules/BenchmarkSelectArea';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';
import { LineChartAndTableOverTime } from '@/components/charts/LineChartOverTime/LineChartAndTableOverTime';
import { CompareAreasTable } from '@/components/charts/CompareAreasTable/CompareAreasTable';
import { compareAreasTableIsRequired } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableIsRequired';
import { OneIndicatorSegmentationOptions } from '@/components/viewPlots/OneIndicatorSegmentationOptions';
import { ThematicMapWrapper } from '@/components/charts/ThematicMap/ThematicMapWrapper';

export function OneIndicatorTwoOrMoreAreasViewPlots({
  indicatorData,
}: Readonly<OneIndicatorViewPlotProps>) {
  const searchState = useSearchStateParams();

  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
    [SearchParams.AreasSelected]: areasSelected,
  } = searchState;

  const healthIndicatorData = indicatorData?.areaHealthData ?? [];

  const availableAreasForBenchmarking = determineAreasForBenchmarking(
    healthIndicatorData,
    selectedGroupCode,
    areasSelected,
    selectedGroupArea
  );

  const showLineChartOverTime = lineChartOverTimeIsRequired(searchState);
  const showCompareAreasTable = compareAreasTableIsRequired(searchState);
  const showThematicMap = selectedGroupArea === ALL_AREAS_SELECTED;

  return (
    <section data-testid="oneIndicatorTwoOrMoreAreasViewPlots-component">
      <BenchmarkSelectArea availableAreas={availableAreasForBenchmarking} />
      <OneIndicatorSegmentationOptions />
      {showLineChartOverTime ? <LineChartAndTableOverTime /> : null}
      {showThematicMap ? <ThematicMapWrapper /> : null}
      {showCompareAreasTable ? <CompareAreasTable /> : null}
    </section>
  );
}
