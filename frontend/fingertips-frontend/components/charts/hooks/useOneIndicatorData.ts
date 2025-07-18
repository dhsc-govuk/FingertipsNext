import { useOneIndicatorRequestParams } from '@/components/charts/hooks/useOneIndicatorRequestParams';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';

export const useOneIndicatorData = () => {
  const requestParams = useOneIndicatorRequestParams();

  const { indicatorMetaData } = useApiGetIndicatorMetaData(
    String(requestParams.indicatorId)
  );

  const { healthData } = useApiGetHealthDataForAnIndicator(requestParams);

  return {
    indicatorMetaData,
    healthData,
  };
};
