import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useInequalitiesRequestParams } from '@/components/charts/Inequalities/hooks/useInequalitiesRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useMemo } from 'react';
import { useIndicatorMetaData } from '@/components/charts/hooks/useIndicatorMetaData';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { inequalitiesData } from '@/components/charts/Inequalities/helpers/inequalitiesData';

export const useInequalitiesData = (chartType = ChartType.SingleTimePeriod) => {
  const searchState = useSearchStateParams();
  const { indicatorMetaData } = useIndicatorMetaData();
  const requestParams = useInequalitiesRequestParams();
  const { healthData } = useApiGetHealthDataForAnIndicator(requestParams);

  return useMemo(() => {
    const data = inequalitiesData(
      searchState,
      indicatorMetaData,
      healthData,
      chartType
    );
    if (!data || !healthData || !indicatorMetaData) return null;
    return data;
  }, [chartType, healthData, indicatorMetaData, searchState]);
};
