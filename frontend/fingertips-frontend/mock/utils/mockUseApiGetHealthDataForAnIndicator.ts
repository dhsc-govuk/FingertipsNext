import { MockedFunction, vi } from 'vitest';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

vi.mock('@/components/charts/hooks/useApiGetHealthDataForAnIndicator');
export const mockUseApiGetHealthDataForAnIndicator =
  useApiGetHealthDataForAnIndicator as MockedFunction<
    typeof useApiGetHealthDataForAnIndicator
  >;

export const mockUseApiGetHealthDataForAnIndicatorSetup = (
  healthData?: IndicatorWithHealthDataForArea,
  healthDataLoading = false,
  healthDataError = null
) => {
  mockUseApiGetHealthDataForAnIndicator.mockReturnValue({
    healthData,
    healthDataLoading,
    healthDataError,
  });
};
