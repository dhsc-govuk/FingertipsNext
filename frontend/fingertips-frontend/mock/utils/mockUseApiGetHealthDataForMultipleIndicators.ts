import { MockedFunction, vi } from 'vitest';
import { useApiGetHealthDataForMultipleIndicators } from '@/components/charts/hooks/useApiGetHealthDataForMultipleIndicators';

vi.mock('@/components/charts/hooks/useApiGetHealthDataForMultipleIndicators');
export const mockUseApiGetHealthDataForMultipleIndicators =
  useApiGetHealthDataForMultipleIndicators as MockedFunction<
    typeof useApiGetHealthDataForMultipleIndicators
  >;
