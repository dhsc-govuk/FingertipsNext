import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useMemo } from 'react';
import { compareAreasTableData } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableData';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
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

    const segmentedData = flattenSegment(healthData, searchState);

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
