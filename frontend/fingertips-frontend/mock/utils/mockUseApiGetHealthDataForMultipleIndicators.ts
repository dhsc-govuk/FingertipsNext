import { MockedFunction, vi } from 'vitest';
import { useApiGetHealthDataForMultipleIndicators } from '@/components/charts/hooks/useApiGetHealthDataForMultipleIndicators';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

vi.mock('@/components/charts/hooks/useApiGetHealthDataForMultipleIndicators');
export const mockUseApiGetHealthDataForMultipleIndicators =
  useApiGetHealthDataForMultipleIndicators as MockedFunction<
    typeof useApiGetHealthDataForMultipleIndicators
  >;

export const mockUseApiGetHealthDataForMultipleIndicatorsSetup = (
  healthData: IndicatorWithHealthDataForArea[] = [],
  healthDataLoading = false,
  healthDataErrors = [],
  healthDataErrored = false
) => {
  mockUseApiGetHealthDataForMultipleIndicators.mockReturnValue({
    healthData,
    healthDataLoading,
    healthDataErrors,
    healthDataErrored,
  });
};
