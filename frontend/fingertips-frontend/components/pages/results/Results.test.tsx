import { render, screen } from '@testing-library/react';

import { RESULTS_PER_PAGE, SearchResults } from '.';
import { IndicatorSelectionState } from '../../forms/IndicatorSelectionForm/indicatorSelectionActions';
import userEvent from '@testing-library/user-event';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { LoaderContext } from '@/context/LoaderContext';

vi.mock('next/navigation', async () => {
  const originalModule = await vi.importActual('next/navigation');

  return {
    ...originalModule,
    usePathname: vi.fn(),
    useSearchParams: () => {
      return {
        get: (key: string) => {
          if (key === 'pn') return '1';
          return null;
        },
      };
    },
    useRouter: vi.fn().mockImplementation(() => ({
      replace: vi.fn(),
    })),
  };
});

function setupMockUseActionState<T>() {
  return vi
    .fn()
    .mockImplementation(
      (
        _: (formState: T, formData: FormData) => Promise<T>,
        initialState: T
      ) => [initialState, '/action']
    );
}

vi.mock('react', async () => {
  const originalModule = await vi.importActual('react');

  return {
    ...originalModule,
    useActionState: setupMockUseActionState<IndicatorSelectionState>(),
  };
});

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

const searchedIndicator = 'test';

let mockSearchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: searchedIndicator,
};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

const MOCK_DATA: IndicatorDocument[] = [
  {
    indicatorID: '1',
    indicatorName: 'NHS',
    indicatorDefinition:
      'Total number of patients registered with the practice',
    earliestDataPeriod: '1996',
    latestDataPeriod: '2023',
    dataSource: 'NHS website',
    lastUpdatedDate: new Date('December 6, 2024'),
    unitLabel: '',
    hasInequalities: false,
  },
  {
    indicatorID: '2',
    indicatorName: 'DHSC',
    indicatorDefinition:
      'Total number of patients registered with the practice',
    earliestDataPeriod: '1997',
    latestDataPeriod: '2022',
    dataSource: 'Student article',
    lastUpdatedDate: new Date('November 5, 2023'),
    unitLabel: '',
    hasInequalities: true,
  },
];

const initialState: IndicatorSelectionState = {
  searchState: JSON.stringify(mockSearchState),
  indicatorsSelected: [],
  message: null,
};

describe('Search Results Suite', () => {
  it('should render elements', () => {
    render(
      <SearchResults
        isEnglandSelectedAsGroup={false}
        initialIndicatorSelectionState={initialState}
        searchResults={[]}
      />
    );

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText(/search results/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading').at(0)?.textContent).toContain(
      searchedIndicator
    );
  });

  it('should render the correct search results title based upon the search term and pagination', () => {
    const LARGE_MOCK_DATA: IndicatorDocument[] = Array.from(
      { length: 33 },
      (_, index) => ({
        ...MOCK_DATA[0],
        indicatorID: `${index}`,
        indicatorName: `Indicator ${index}`,
      })
    );

    render(
      <SearchResults
        isEnglandSelectedAsGroup={false}
        initialIndicatorSelectionState={initialState}
        searchResults={LARGE_MOCK_DATA}
      />
    );
    const title = screen.getByRole('heading', {
      name: /search results/i,
    });

    expect(title).toHaveTextContent(
      `Search results for ${searchedIndicator} (page 1 of 3)`
    );
  });

  it('should default to page 1 if the current page is greater than the total pages', () => {
    const LARGE_MOCK_DATA: IndicatorDocument[] = Array.from(
      { length: 33 },
      (_, index) => ({
        ...MOCK_DATA[0],
        indicatorID: `${index}`,
        indicatorName: `Indicator ${index}`,
      })
    );
    mockSearchState = {
      [SearchParams.SearchedIndicator]: searchedIndicator,
      [SearchParams.PageNumber]: '5',
    };
    const totalPages = Math.ceil(LARGE_MOCK_DATA.length / RESULTS_PER_PAGE);

    render(
      <SearchResults
        isEnglandSelectedAsGroup={false}
        initialIndicatorSelectionState={initialState}
        searchResults={LARGE_MOCK_DATA}
      />
    );
    const title = screen.getByRole('heading', {
      name: /search results/i,
    });

    expect(title).toHaveTextContent(
      `Search results for ${searchedIndicator} (page 1 of ${totalPages})`
    );
  });

  it('should render the backLink', () => {
    mockSearchState = {
      [SearchParams.SearchedIndicator]: searchedIndicator,
    };

    render(
      <SearchResults
        isEnglandSelectedAsGroup={false}
        initialIndicatorSelectionState={initialState}
        searchResults={[]}
      />
    );

    const backLink = screen.getByRole('link', { name: /back/i });

    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('data-testid', 'search-results-back-link');
    expect(backLink.getAttribute('href')).toBe(
      `/?${SearchParams.SearchedIndicator}=${searchedIndicator}`
    );
  });

  it('should render the IndicatorSearchForm', () => {
    render(
      <SearchResults
        isEnglandSelectedAsGroup={false}
        initialIndicatorSelectionState={initialState}
        searchResults={[]}
      />
    );

    expect(screen.getByTestId('indicator-search-form')).toBeInTheDocument();
  });

  it('should render the AreaFilter', () => {
    render(
      <SearchResults
        isEnglandSelectedAsGroup={false}
        initialIndicatorSelectionState={initialState}
        searchResults={[]}
      />
    );

    expect(screen.getByTestId('area-filter-container')).toBeInTheDocument();
  });

  it('should render the IndicatorSelectionForm', () => {
    render(
      <SearchResults
        isEnglandSelectedAsGroup={false}
        initialIndicatorSelectionState={initialState}
        searchResults={[]}
      />
    );

    expect(screen.getByTestId('indicator-selection-form')).toBeInTheDocument();
  });

  it('should render the error summary component when there is a validation error', () => {
    const errorMessage = 'There was an error';
    const errorState: IndicatorSelectionState = {
      ...initialState,
      message: errorMessage,
      errors: {},
    };

    render(
      <SearchResults
        isEnglandSelectedAsGroup={false}
        initialIndicatorSelectionState={errorState}
        searchResults={MOCK_DATA}
      />
    );

    expect(
      screen.getByTestId('search-result-form-error-summary')
    ).toBeInTheDocument();
  });

  it('should focus to the first checkbox when clicking on the error link in the summary', async () => {
    const scrollMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollMock;

    const user = userEvent.setup();

    const errorState: IndicatorSelectionState = {
      ...initialState,
      message: 'Some error',
      errors: {},
    };

    render(
      <SearchResults
        isEnglandSelectedAsGroup={false}
        initialIndicatorSelectionState={errorState}
        searchResults={MOCK_DATA}
      />
    );

    const errorLink = screen
      .getByText('Select any indicators you want to view')
      .closest('a')!;

    await user.click(errorLink);

    expect(screen.getByRole('checkbox', { name: /NHS/i })).toHaveFocus();
    expect(scrollMock).toBeCalledTimes(1);
  });
});
