import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useMemo } from 'react';
import { spineChartRequestParams } from '@/components/charts/SpineChart/helpers/spineChartRequestParams';
import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';

export const useSpineChartRequestParams =
  (): GetHealthDataForAnIndicatorRequest[] => {
    const searchState = useSearchStateParams();
    return useMemo(() => {
      return spineChartRequestParams(searchState);
    }, [searchState]);
  };
