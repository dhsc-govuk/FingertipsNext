import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useInequalitiesRequestParams } from '@/components/charts/Inequalities/hooks/useInequalitiesRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useMemo } from 'react';
import { useIndicatorMetaData } from '@/components/charts/hooks/useIndicatorMetaData';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { inequalitiesData } from '@/components/charts/Inequalities/helpers/inequalitiesData';
import { withoutYears } from '@/lib/healthDataHelpers/withoutYears';

export const useInequalitiesData = (
  chartType = ChartType.SingleTimePeriod,
  clean = false
) => {
  const searchState = useSearchStateParams();
  const { indicatorMetaData } = useIndicatorMetaData();
  const requestParams = useInequalitiesRequestParams();
  const { healthData } = useApiGetHealthDataForAnIndicator(requestParams);

  return useMemo(() => {
    if (!healthData || !indicatorMetaData) return null;
    const cleanData = withoutYears(healthData, {
      removeSex: true,
      removeAge: true,
    });

    const data = inequalitiesData(
      searchState,
      indicatorMetaData,
      clean ? cleanData : healthData,
      chartType
    );

    console.log({ healthData, cleanData, clean, data });
    return {
      healthData: clean ? cleanData : healthData,
      indicatorMetaData,
      chartData: data,
    };
  }, [chartType, clean, healthData, indicatorMetaData, searchState]);
};
