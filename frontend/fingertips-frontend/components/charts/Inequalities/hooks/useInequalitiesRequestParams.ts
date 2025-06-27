import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useMemo } from 'react';
import { inequalitiesRequestParams } from '@/components/charts/Inequalities/helpers/inequalitiesRequestParams';

export const useInequalitiesRequestParams =
  (): GetHealthDataForAnIndicatorRequest => {
    const searchState = useSearchStateParams();
    return useMemo(() => {
      return inequalitiesRequestParams(searchState);
    }, [searchState]);
  };
