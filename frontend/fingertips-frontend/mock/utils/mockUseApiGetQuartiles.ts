import { MockedFunction, vi } from 'vitest';
import { useApiGetQuartiles } from '@/components/charts/hooks/useApiGetQuartiles';

vi.mock('@/components/charts/hooks/useApiGetQuartiles');
export const mockUseApiGetQuartiles = useApiGetQuartiles as MockedFunction<
  typeof useApiGetQuartiles
>;
