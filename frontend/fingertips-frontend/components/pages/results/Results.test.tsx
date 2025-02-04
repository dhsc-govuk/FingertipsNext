import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResults } from '.';
import { SearchResultState } from './searchResultsActions';
import userEvent from '@testing-library/user-event';
import { SearchParams } from '@/lib/searchStateManager';
import { formatDate } from '@/components/molecules/result';
import { IndicatorDocument } from '@/lib/search/searchTypes';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
    useRouter: jest.fn().mockImplementation(() => ({
      replace: jest.fn(),
    })),
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

describe('Search Results Suite', () => {
  const searchedIndicator = 'test';
  const initialState: SearchResultState = {
    searchedIndicator,
    indicatorsSelected: [],
    message: null,
  };
  const initialStateIndicatorSelected = {
    ...initialState,
    indicatorsSelected: ['1'],
  };

  it.only('should render elements', () => {
    render(
      <SearchResults searchResultsFormState={initialState} searchResults={[]} />
    );

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText(/search results/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading').at(0)?.textContent).toContain(
      searchedIndicator
    );
  });

  it('should render the backLink', () => {
    render(
      <SearchResults searchResultsFormState={initialState} searchResults={[]} />
    );

    const backLink = screen.getByRole('link', { name: /back/i });

    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('data-testid', 'search-results-back-link');
    expect(backLink.getAttribute('href')).toBe(
      `/?${SearchParams.SearchedIndicator}=${searchedIndicator}`
    );
  });

  it('should render search results', () => {
    render(
      <SearchResults
        searchResultsFormState={initialState}
        searchResults={MOCK_DATA}
      />
    );

    const searchResults = screen.getAllByTestId('search-result');

    expect(searchResults).toHaveLength(MOCK_DATA.length);
    searchResults.forEach((searchResult, index) => {
      expect(searchResult).toHaveTextContent(MOCK_DATA[index].name);
      expect(searchResult).toHaveTextContent(MOCK_DATA[index].latestDataPeriod);
      expect(searchResult).toHaveTextContent(MOCK_DATA[index].dataSource);
      expect(searchResult).toHaveTextContent(
        formatDate(new Date(MOCK_DATA[index].lastUpdated))
      );
    });
    expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
  });

  it('should not render elements when no indicator is entered', () => {
    const initialStateWithNoIndicator = {
      ...initialState,
      searchedIndicator: undefined,
    };

    render(
      <SearchResults
        searchResultsFormState={initialStateWithNoIndicator}
        searchResults={MOCK_DATA}
      />
    );

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText(/no indicator entered/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('search-result')).toHaveLength(0);
  });

  it('should render no results found', () => {
    render(
      <SearchResults searchResultsFormState={initialState} searchResults={[]} />
    );

    expect(screen.queryByText(/no results found/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('search-result')).toHaveLength(0);
  });

  it('should mark indicators selected as checked', () => {
    render(
      <SearchResults
        searchResultsFormState={initialStateIndicatorSelected}
        searchResults={MOCK_DATA}
      />
    );

    expect(screen.getByRole('checkbox', { name: /NHS/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /DHSC/i })).not.toBeChecked();
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
        searchResultsFormState={errorState}
        searchResults={MOCK_DATA}
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
        searchResultsFormState={errorState}
        searchResults={MOCK_DATA}
      />
    );

    const errorLink = screen.getByText('Available indicators').closest('a')!;

    await user.click(errorLink);

    expect(screen.getByRole('checkbox', { name: /NHS/i })).toHaveFocus();
    expect(scrollMock).toBeCalledTimes(1);
  });

  it('should have appropriate direct link for each indicator regardless of checkbox state', () => {
    const expectedPaths = [
      `/chart?${SearchParams.IndicatorsSelected}=${MOCK_DATA[0].indicatorId.toString()}`,
      `/chart?${SearchParams.IndicatorsSelected}=${MOCK_DATA[1].indicatorId.toString()}`,
    ];

    render(
      <SearchResults
        searchResultsFormState={initialStateIndicatorSelected}
        searchResults={MOCK_DATA}
      />
    );

    expect(
      screen.getByRole('link', { name: MOCK_DATA[0].name })
    ).toHaveAttribute('href', expectedPaths[0]);
    expect(
      screen.getByRole('link', { name: MOCK_DATA[1].name })
    ).toHaveAttribute('href', expectedPaths[1]);
  });

  it('snapshot test', () => {
    const container = render(
      <SearchResults
        searchResultsFormState={initialState}
        searchResults={MOCK_DATA}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should contain the searched indicator in the search box', async () => {
    render(
      <SearchResults searchResultsFormState={initialState} searchResults={[]} />
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /indicator/i }),
      searchedIndicator
    );
  });

  it('should reset the input field when the "reset search" button is clicked', async () => {
    const typedText = 'additional text';
    render(
      <SearchResults searchResultsFormState={initialState} searchResults={[]} />
    );

    await userEvent.type(screen.getByRole('textbox'), typedText);
    expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
      searchedIndicator + typedText
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reset Search' }));
    expect(screen.getByRole('textbox', { name: /indicator/i })).toHaveValue(
      searchedIndicator
    );

    screen.getByRole('textbox');
  });

  it('should display an error when the user attempts to search for no indicator and no areas', async () => {
    const errorMessage = 'Please enter a subject';

    render(
      <SearchResults searchResultsFormState={initialState} searchResults={[]} />
    );
    await userEvent.clear(screen.getByRole('textbox', { name: /indicator/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByTestId('indicator-search-error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
