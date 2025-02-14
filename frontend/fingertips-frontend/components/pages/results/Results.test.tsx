import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResults } from '.';
import { SearchResultState } from '../../forms/IndicatorSelectionForm/searchResultsActions';
import userEvent from '@testing-library/user-event';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: jest.fn(),
    useSearchParams: () => {},
    useRouter: jest.fn().mockImplementation(() => ({
      replace: jest.fn(),
    })),
  };
});
function setupMockUseActionState<T>() {
  return jest
    .fn()
    .mockImplementation(
      (
        _: (formState: T, formData: FormData) => Promise<T>,
        initialState: T
      ) => [initialState, '/action']
    );
}

jest.mock('react', () => {
  const originalModule = jest.requireActual('react');

  return {
    ...originalModule,
    useActionState: setupMockUseActionState<SearchResultState>(),
  };
});

const MOCK_DATA: IndicatorDocument[] = [
  {
    indicatorId: '1',
    name: 'NHS',
    definition: 'Total number of patients registered with the practice',
    latestDataPeriod: '2023',
    dataSource: 'NHS website',
    lastUpdated: new Date('December 6, 2024'),
  },
  {
    indicatorId: '2',
    name: 'DHSC',
    definition: 'Total number of patients registered with the practice',
    latestDataPeriod: '2022',
    dataSource: 'Student article',
    lastUpdated: new Date('November 5, 2023'),
  },
];
const searchedIndicator = 'test';
const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: searchedIndicator,
};
const initialState: SearchResultState = {
  searchState: JSON.stringify(state),
  indicatorsSelected: [],
  message: null,
};

describe('Search Results Suite', () => {
  it('should render elements', () => {
    render(
      <SearchResults
        searchResultsState={initialState}
        searchResults={[]}
        searchState={state}
      />
    );

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText(/search results/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading').at(0)?.textContent).toContain(
      searchedIndicator
    );
  });

  it('should render the backLink', () => {
    render(
      <SearchResults
        searchResultsState={initialState}
        searchResults={[]}
        searchState={state}
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
        searchResultsState={initialState}
        searchResults={[]}
        searchState={state}
      />
    );

    expect(screen.getByTestId('indicator-search-form')).toBeInTheDocument();
  });

  it('should render the AreaFilter', () => {
    render(
      <SearchResults
        searchResultsState={initialState}
        searchResults={[]}
        searchState={state}
      />
    );

    expect(screen.getByTestId('area-filter-container')).toBeInTheDocument();
  });

  it('should render the IndicatorSelectionForm', () => {
    render(
      <SearchResults
        searchResultsState={initialState}
        searchResults={[]}
        searchState={state}
      />
    );

    expect(screen.getByTestId('indicator-selection-form')).toBeInTheDocument();
  });

  it('should render the error summary component when there is a validation error', () => {
    const errorMessage = 'There was an error';
    const errorState: SearchResultState = {
      ...initialState,
      message: errorMessage,
      errors: {},
    };

    render(
      <SearchResults
        searchResultsState={errorState}
        searchResults={MOCK_DATA}
        searchState={state}
      />
    );

    expect(
      screen.getByTestId('search-result-form-error-summary')
    ).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should focus to the first checkbox when clicking on the error link in the summary', async () => {
    const scrollMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollMock;

    const user = userEvent.setup();

    const errorState: SearchResultState = {
      ...initialState,
      message: 'Some error',
      errors: {},
    };

    render(
      <SearchResults
        searchResultsState={errorState}
        searchResults={MOCK_DATA}
        searchState={state}
      />
    );

    const errorLink = screen.getByText('Available indicators').closest('a')!;

    await user.click(errorLink);

    expect(screen.getByRole('checkbox', { name: /NHS/i })).toHaveFocus();
    expect(scrollMock).toBeCalledTimes(1);
  });
});
