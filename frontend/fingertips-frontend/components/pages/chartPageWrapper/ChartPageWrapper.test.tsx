import { render, screen } from '@testing-library/react';
import { ChartPageWrapper } from '.';
import { SearchStateParams, SearchParams } from '@/lib/searchStateManager';
import { LoaderContext } from '@/context/LoaderContext';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

const mockGetIsLoading = jest.fn();
const mockSetIsLoading = jest.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: mockGetIsLoading,
  setIsLoading: mockSetIsLoading,
};

jest.mock('@/context/LoaderContext', () => {
  return {
    useLoader: () => mockLoaderContext,
  };
});

const ChildComponent = () => (
  <div data-testid="some-child-component">Child component</div>
);

const mockSearch = 'test';
const mockIndicator = ['108'];
const mockAreas = ['E12000001', 'E12000003'];

const searchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: mockIndicator,
  [SearchParams.AreasSelected]: mockAreas,
};

describe('ChartPageWrapper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the loading box when getIsLoading is true', () => {
    mockGetIsLoading.mockReturnValue(true);

    render(
      <ChartPageWrapper searchState={searchState}>
        <ChildComponent />
      </ChartPageWrapper>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should not render the loading box when getIsLoading is false', () => {
    mockGetIsLoading.mockReturnValue(false);

    render(
      <ChartPageWrapper searchState={searchState}>
        <ChildComponent />
      </ChartPageWrapper>
    );

    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  it('should render the back link path back to the results page', () => {
    render(
      <ChartPageWrapper searchState={searchState}>
        <ChildComponent />
      </ChartPageWrapper>
    );

    const backLink = screen.getByRole('link', { name: /back/i });
    const expectedUrl = `/results?${SearchParams.SearchedIndicator}=${mockSearch}&${SearchParams.IndicatorsSelected}=${mockIndicator}&${SearchParams.AreasSelected}=${mockAreas[0]}&${SearchParams.AreasSelected}=${mockAreas[1]}`;

    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('data-testid', 'chart-page-back-link');
    expect(backLink).toHaveAttribute('href', expectedUrl);
  });

  it('should call setIsLoading when the back link is clicked', async () => {
    render(
      <ChartPageWrapper searchState={searchState}>
        <ChildComponent />
      </ChartPageWrapper>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /back/i }));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('should render the area filter pane', () => {
    render(
      <ChartPageWrapper searchState={searchState}>
        <ChildComponent />
      </ChartPageWrapper>
    );

    expect(screen.getByTestId('area-filter-container')).toBeInTheDocument();
  });

  it('should render the child component', () => {
    render(
      <ChartPageWrapper searchState={searchState}>
        <ChildComponent />
      </ChartPageWrapper>
    );

    expect(screen.getByTestId('some-child-component')).toBeInTheDocument();
  });
});
