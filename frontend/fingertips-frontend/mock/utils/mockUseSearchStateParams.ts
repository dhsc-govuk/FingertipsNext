import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { MockedFunction, vi } from 'vitest';

vi.mock('@/components/hooks/useSearchStateParams');
export const mockUseSearchStateParams = useSearchStateParams as MockedFunction<
  typeof useSearchStateParams
>;
