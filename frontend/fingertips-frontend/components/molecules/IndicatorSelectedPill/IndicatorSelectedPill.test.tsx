import { render, screen } from '@testing-library/react';
import { IndicatorSelectedPill } from './index';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import { LoaderContext } from '@/context/LoaderContext';
import userEvent from '@testing-library/user-event';
import { SearchStateContext } from '@/context/SearchStateContext';

const mockIndicator = generateIndicatorDocument('1');

const mockSetIsLoading = jest.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: jest.fn(),
  setIsLoading: mockSetIsLoading,
};

jest.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockGetSearchState = jest.fn().mockReturnValue({
  [SearchParams.AreasSelected]: ['A001', 'A002'],
  [SearchParams.IndicatorsSelected]: ['1'],
} satisfies SearchStateParams);
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

describe('IndicatorSelectedPill', () => {
  it('should render the IndicatorSelectedPill correctly', () => {
    render(<IndicatorSelectedPill indicator={mockIndicator} />);
    expect(screen.getByText(mockIndicator.indicatorName)).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('should have the correct href with searchState as query param to the indicator meta data page', async () => {
    const expectedPath = [
      `/indicator/${mockIndicator.indicatorID}`,
      `?${SearchParams.IndicatorsSelected}=${mockIndicator.indicatorID}`,
      `&${SearchParams.AreasSelected}=A001&${SearchParams.AreasSelected}=A002`,
    ].join('');

    render(<IndicatorSelectedPill indicator={mockIndicator} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', expectedPath);
  });

  it('should call setIsLoading with true when the Add or change indicators button is clicked', async () => {
    const user = userEvent.setup();
    render(<IndicatorSelectedPill indicator={mockIndicator} />);

    await user.click(screen.getByRole('link'));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('should match snapshot', () => {
    const { asFragment } = render(
      <IndicatorSelectedPill indicator={mockIndicator} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
