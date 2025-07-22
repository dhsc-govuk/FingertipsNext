'use client';

import { SpineChartTable } from '@/components/charts/SpineChart/SpineChartTable/SpineChartTable';
import { determineBenchmarkToUse } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams } from '@/lib/searchStateManager';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

import { useSpineChartData } from '@/components/charts/SpineChart/hooks/useSpineChartData';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { useMultipleIndicatorData } from '@/components/charts/hooks/useMultipleIndicatorData';

export function MultipleIndicatorSpineChart() {
  const searchState = useSearchStateParams();
  const { [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected } =
    searchState;

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  const { healthData, indicatorMetaData } = useMultipleIndicatorData();
  const spineChartIndicatorData = useSpineChartData(
    healthData,
    indicatorMetaData
  );
  if (!spineChartIndicatorData) return null;

  return (
    <StyleChartWrapper>
      <SpineChartTable
        indicatorData={spineChartIndicatorData}
        benchmarkToUse={benchmarkToUse}
      />
    </StyleChartWrapper>
  );
}
