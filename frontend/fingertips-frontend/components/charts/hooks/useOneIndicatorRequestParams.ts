import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useMemo } from 'react';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import { useApiAvailableAreas } from '@/components/charts/hooks/useApiAvailableAreas';

export const useOneIndicatorRequestParams =
  (): GetHealthDataForAnIndicatorRequest => {
    const searchState = useSearchStateParams();
    const { availableAreas } = useApiAvailableAreas();
    return useMemo(() => {
      return oneIndicatorRequestParams(searchState, availableAreas ?? []);
    }, [availableAreas, searchState]);
  };
