import { useLoadingState } from '@/context/LoaderContext';
import { MockedFunction } from 'vitest';

vi.mock('@/context/LoaderContext');

export const mockUseLoadingState = useLoadingState as MockedFunction<
  typeof useLoadingState
>;

export const mockSetIsLoading = vi.fn();
export const mockGetIsLoading = vi.fn();

mockUseLoadingState.mockReturnValue({
  setIsLoading: mockSetIsLoading,
  getIsLoading: mockGetIsLoading,
});
