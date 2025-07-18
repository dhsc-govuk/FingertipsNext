import { MockedFunction, vi } from 'vitest';
import { useApiGetIndicatorMetaDatas } from '@/components/charts/hooks/useApiGetIndicatorMetaDatas';
import { IndicatorDocument } from '@/lib/search/searchTypes';

vi.mock('@/components/charts/hooks/useApiGetIndicatorMetaDatas');
export const mockUseApiGetIndicatorMetaDatas =
  useApiGetIndicatorMetaDatas as MockedFunction<
    typeof useApiGetIndicatorMetaDatas
  >;

export const mockUseApiGetIndicatorMetaDatasSetup = (
  indicatorMetaData: IndicatorDocument[] = [],
  indicatorMetaDataLoading = false,
  indicatorMetaDataError = null
) => {
  mockUseApiGetIndicatorMetaDatas.mockReturnValue({
    indicatorMetaData,
    indicatorMetaDataError,
    indicatorMetaDataLoading,
  });
};
