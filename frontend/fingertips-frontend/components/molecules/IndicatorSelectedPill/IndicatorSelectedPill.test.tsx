import { render, screen } from '@testing-library/react';
import { IndicatorSelectedPill } from './index';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import { LoaderContext } from '@/context/LoaderContext';

const mockIndicator = generateIndicatorDocument('1');

const mockSetIsLoading = vi.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: vi.fn(),
  setIsLoading: mockSetIsLoading,
};

vi.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockSearchState: SearchStateParams = {
  [SearchParams.AreasSelected]: ['A001', 'A002'],
  [SearchParams.IndicatorsSelected]: ['1'],
};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

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

  it('should match snapshot', () => {
    const { asFragment } = render(
      <IndicatorSelectedPill indicator={mockIndicator} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
