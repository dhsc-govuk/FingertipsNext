import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';

export const useIndicatorMetaData = () => {
  const { [SearchParams.IndicatorsSelected]: selectedIndicators } =
    useSearchStateParams();

  return useApiGetIndicatorMetaData(selectedIndicators?.at(0) ?? '');
};
