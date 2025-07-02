import { MockedFunction, vi } from 'vitest';
import { useApiGetHealthDataForAnIndicator } from '@/components/charts/hooks/useApiGetHealthDataForAnIndicator';

vi.mock('@/components/charts/hooks/useApiGetHealthDataForAnIndicator');
export const mockUseApiGetHealthDataForAnIndicator =
  useApiGetHealthDataForAnIndicator as MockedFunction<
    typeof useApiGetHealthDataForAnIndicator
  >;
