import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useMemo } from 'react';
import { compareAreasTableData } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableData';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';
import { flattenSegment } from '@/lib/healthDataHelpers/flattenSegment';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import { useOneIndicatorRequestParams } from '@/components/charts/hooks/useOneIndicatorRequestParams';

export const useCompareAreasTableData = () => {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
  } = searchState;

  const requestParams = useOneIndicatorRequestParams();

  const { indicatorMetaData } = useApiGetIndicatorMetaData(
    String(requestParams.indicatorId)
  );

  const { healthData } = useApiGetHealthDataForAnIndicator(requestParams);

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
