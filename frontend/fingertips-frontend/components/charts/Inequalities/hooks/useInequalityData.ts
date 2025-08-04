import { useInequalitiesRequestParams } from '@/components/charts/Inequalities/hooks/useInequalitiesRequestParams';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { useMemo } from 'react';
import { useIndicatorMetaData } from '@/components/charts/hooks/useIndicatorMetaData';
import { withoutYears } from '@/lib/healthDataHelpers/withoutYears';

export const useInequalityData = () => {
  const { indicatorMetaData } = useIndicatorMetaData();
  const requestParams = useInequalitiesRequestParams();
  const { healthData } = useApiGetHealthDataForAnIndicator(requestParams);

  return useMemo(() => {
    if (!healthData || !indicatorMetaData) return null;
    const cleanData = withoutYears(healthData, {
      removeSex: true,
      removeAge: true,
    });

    return { healthData: cleanData, indicatorMetaData };
  }, [healthData, indicatorMetaData]);
};
