import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useMemo } from 'react';
import { compareAreasTableData } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableData';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import { useOneIndicatorData } from '@/components/charts/hooks/useOneIndicatorData';

export const useCompareAreasTableData = () => {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
  } = searchState;

  const { healthData, indicatorMetaData } = useOneIndicatorData();

  return useMemo(() => {
    if (!healthData) return null;
    // the api work to allow segmentation for quintiles is not ready yet
    // so we need to handle it in the old way for now.
    const isNotQuintiles =
      healthData.benchmarkMethod !== BenchmarkComparisonMethod.Quintiles;

    const segmentedData = isNotQuintiles
      ? flattenSegment(healthData, searchState)
      : healthData;

    return {
      indicatorMetaData,
      name: segmentedData.name,
      ...compareAreasTableData(
        segmentedData,
        selectedGroupCode,
        benchmarkAreaSelected
      ),
    };
  }, [
    healthData,
    searchState,
    indicatorMetaData,
    selectedGroupCode,
    benchmarkAreaSelected,
  ]);
};
