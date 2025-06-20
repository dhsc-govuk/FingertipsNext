import { useLoadingState } from '@/context/LoaderContext';

jest.mock('@/context/LoaderContext');

export const mockUseLoadingState = useLoadingState as jest.MockedFunction<
  typeof useLoadingState
>;

export const mockSetIsLoading = jest.fn();
export const mockGetIsLoading = jest.fn();

mockUseLoadingState.mockReturnValue({
  setIsLoading: mockSetIsLoading,
  getIsLoading: mockGetIsLoading,
});
