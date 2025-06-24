import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useLineChartOverTimeRequestParams } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';
import { lineChartOverTimeData } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeData';
import { useMemo } from 'react';
import { lineChartOverTimeIsRequired } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeIsRequired';

export const useLineChartOverTimeData = () => {
  const searchState = useSearchStateParams();
  const {
    [SearchParams.IndicatorsSelected]: indicatorIds,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
    [SearchParams.AreasSelected]: areasSelected,
  } = searchState;

  const indicatorId = indicatorIds?.at(0) ?? '';

  const apiReqParams = useLineChartOverTimeRequestParams();

  const { healthData } = useApiGetHealthDataForAnIndicator(apiReqParams);

  const { indicatorMetaData } = useApiGetIndicatorMetaData(indicatorId);

  const isRequired = lineChartOverTimeIsRequired(searchState);

  return useMemo(() => {
    if (!healthData || !indicatorMetaData || !isRequired) return null;
    return lineChartOverTimeData(
      indicatorMetaData,
      healthData,
      areasSelected ?? [],
      selectedGroupCode,
      benchmarkAreaSelected
    );
  }, [
    areasSelected,
    benchmarkAreaSelected,
    healthData,
    indicatorMetaData,
    isRequired,
    selectedGroupCode,
  ]);
};
