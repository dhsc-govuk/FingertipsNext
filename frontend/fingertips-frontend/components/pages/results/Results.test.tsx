import { render, screen, waitFor } from '@testing-library/react';
import { expect } from '@jest/globals';
import { MOCK_DATA } from '@/app/results/search-result-data';
import { SearchResults } from '.';
import { SearchResultState } from './searchResultsActions';
import userEvent from '@testing-library/user-event';

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
  const indicator = 'test';
  const initialState: SearchResultState = {
    indicator,
    indicatorsSelected: [],
    message: null,
  };
  const initialStateIndicatorSelected = {
    ...initialState,
    indicatorsSelected: ['1'],
  };

  it('should render elements', async () => {
    render(
      <SearchResults searchResultsFormState={initialState} searchResults={[]} />
    );

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText(/search results/i)).toBeInTheDocument();
    expect(screen.getAllByRole('paragraph').at(0)?.textContent).toContain(
      indicator
    );
  });

  it('should render the backLink', () => {
    render(
      <SearchResults searchResultsFormState={initialState} searchResults={[]} />
    );

    expect(screen.getByRole('link', { name: /back/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back/i }).getAttribute('href')
    ).toBe('/results?indicator=test');
  });

  it('should render search results', () => {
    render(
      <SearchResults
        searchResultsFormState={initialState}
        searchResults={MOCK_DATA}
      />
    );

    expect(screen.getAllByTestId('search-result')).toHaveLength(
      MOCK_DATA.length
    );
    expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
  });

  it('should not render elements when no indicator is entered', () => {
    const initialStateWithNoIndicator = {
      ...initialState,
      indicator: undefined,
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

    expect(
      screen.getByTestId('search-result-form-error-summary')
    ).toBeInTheDocument();
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

    const errorLink = screen.getByText('Available indicators').closest('a');
    if (errorLink) {
      await user.click(errorLink);
    }

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /NHS/i })).toHaveFocus();
    });
    expect(scrollMock).toBeCalledTimes(1);
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
});
