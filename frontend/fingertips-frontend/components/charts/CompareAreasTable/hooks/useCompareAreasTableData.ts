import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useCompareAreasTableRequestParams } from '@/components/charts/CompareAreasTable/hooks/useCompareAreasTableRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useMemo } from 'react';
import { compareAreasTableData } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableData';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';

export const useCompareAreasTableData = () => {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
  } = searchState;

  const requestParams = useCompareAreasTableRequestParams();

  const { indicatorMetaData } = useApiGetIndicatorMetaData(
    String(requestParams.indicatorId)
  );

  const { healthData } = useApiGetHealthDataForAnIndicator(requestParams);

  return useMemo(() => {
    if (!healthData) return null;
    return {
      indicatorMetaData,
      ...compareAreasTableData(
        healthData,
        selectedGroupCode,
        benchmarkAreaSelected
      ),
    };
  }, [healthData, indicatorMetaData, benchmarkAreaSelected, selectedGroupCode]);
};
