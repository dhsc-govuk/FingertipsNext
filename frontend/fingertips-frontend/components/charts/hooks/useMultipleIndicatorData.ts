import { useMultipleIndicatorRequestParams } from '@/components/charts/hooks/useMultipleIndicatorRequestParams';
import { useApiGetIndicatorMetaDatas } from '@/components/charts/hooks/useApiGetIndicatorMetaDatas';
import { useApiGetHealthDataForMultipleIndicators } from '@/components/charts/hooks/useApiGetHealthDataForMultipleIndicators';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';

export const useMultipleIndicatorData = () => {
  const searchState = useSearchStateParams();
  const { [SearchParams.IndicatorsSelected]: indicatorIds = [] } = searchState;
  const { indicatorMetaData } = useApiGetIndicatorMetaDatas(indicatorIds);
  const requestParams = useMultipleIndicatorRequestParams();
  const { healthData } =
    useApiGetHealthDataForMultipleIndicators(requestParams);

  return {
    indicatorMetaData,
    healthData,
  };
};
