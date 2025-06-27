'use client';

import { SpineChartTable } from '@/components/charts/SpineChart/SpineChartTable/SpineChartTable';
import { determineBenchmarkToUse } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams } from '@/lib/searchStateManager';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

import { useSpineChartData } from '@/components/charts/SpineChart/hooks/useSpineChartData';

export function SpineChartWrapper() {
  const searchState = useSearchStateParams();
  const { [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected } =
    searchState;

  const benchmarkToUse = determineBenchmarkToUse(benchmarkAreaSelected);

  const spineChartIndicatorData = useSpineChartData();
  if (!spineChartIndicatorData) return null;

  return (
    <SpineChartTable
      indicatorData={spineChartIndicatorData}
      benchmarkToUse={benchmarkToUse}
    />
  );
}
