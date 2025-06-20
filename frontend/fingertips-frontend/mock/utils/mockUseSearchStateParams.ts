import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

jest.mock('@/components/hooks/useSearchStateParams');
export const mockUseSearchStateParams =
  useSearchStateParams as jest.MockedFunction<typeof useSearchStateParams>;
