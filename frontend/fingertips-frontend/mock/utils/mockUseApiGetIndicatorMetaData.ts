import { MockedFunction, vi } from 'vitest';
import { useApiGetIndicatorMetaData } from '@/components/charts/hooks/useApiGetIndicatorMetaData';
import { IndicatorDocument } from '@/lib/search/searchTypes';

vi.mock('@/components/charts/hooks/useApiGetIndicatorMetaData');
export const mockUseApiGetIndicatorMetaData =
  useApiGetIndicatorMetaData as MockedFunction<
    typeof useApiGetIndicatorMetaData
  >;

export const mockUseApiGetIndicatorMetaDataSetup = (
  indicatorMetaData?: IndicatorDocument,
  indicatorMetaDataLoading = false,
  indicatorMetaDataError = null
) => {
  mockUseApiGetIndicatorMetaData.mockReturnValue({
    indicatorMetaData,
    indicatorMetaDataError,
    indicatorMetaDataLoading,
  });
};
