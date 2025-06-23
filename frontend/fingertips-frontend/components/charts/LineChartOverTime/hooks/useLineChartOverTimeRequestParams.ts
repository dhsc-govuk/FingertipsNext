import { GetHealthDataForAnIndicatorRequest } from '@/generated-sources/ft-api-client';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useMemo } from 'react';
import { lineChartOverTimeRequestParams } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeRequestParams';

export const useLineChartOverTimeRequestParams =
  (): GetHealthDataForAnIndicatorRequest => {
    const searchState = useSearchStateParams();
    return useMemo(() => {
      return lineChartOverTimeRequestParams(searchState);
    }, [searchState]);
  };
