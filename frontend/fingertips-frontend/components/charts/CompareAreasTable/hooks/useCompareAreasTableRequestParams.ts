import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useMemo } from 'react';
import { compareAreasTableRequestParams } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableRequestParams';
import { useApiAvailableAreas } from '@/components/charts/hooks/useApiAvailableAreas';

export const useCompareAreasTableRequestParams =
  (): GetHealthDataForAnIndicatorRequest => {
    const searchState = useSearchStateParams();
    const { availableAreas } = useApiAvailableAreas();
    return useMemo(() => {
      return compareAreasTableRequestParams(searchState, availableAreas ?? []);
    }, [searchState, availableAreas]);
  };
