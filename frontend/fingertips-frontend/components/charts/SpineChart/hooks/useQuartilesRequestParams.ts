import { IndicatorsQuartilesGetRequest } from '@/generated-sources/ft-api-client';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { useMemo } from 'react';
import { quartilesQueryParams } from '@/components/charts/SpineChart/helpers/quartilesQueryParams';

export const useQuartilesRequestParams = (): IndicatorsQuartilesGetRequest => {
  const searchState = useSearchStateParams();
  return useMemo(() => {
    return quartilesQueryParams(searchState);
  }, [searchState]);
};
