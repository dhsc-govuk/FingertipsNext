import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useMemo } from 'react';
import { multipleIndicatorRequestParams } from '@/components/charts/helpers/multipleIndicatorRequestParams';
import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';
import { useApiAvailableAreas } from '@/components/charts/hooks/useApiAvailableAreas';

export const useMultipleIndicatorRequestParams =
  (): GetHealthDataForAnIndicatorRequest[] => {
    const searchState = useSearchStateParams();
    const { availableAreas } = useApiAvailableAreas();
    return useMemo(() => {
      return multipleIndicatorRequestParams(searchState, availableAreas);
    }, [searchState, availableAreas]);
  };
