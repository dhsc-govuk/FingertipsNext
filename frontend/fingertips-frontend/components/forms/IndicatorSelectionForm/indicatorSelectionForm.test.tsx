import { render, screen, within, fireEvent } from '@testing-library/react';
import { IndicatorSelectionForm } from '.';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { formatDate } from '@/lib/dateHelpers/dateHelpers';
import { LoaderContext } from '@/context/LoaderContext';
import { SortOrderKeys } from '@/components/forms/IndicatorSort/indicatorSort.types';
import { RESULTS_PER_PAGE } from '@/components/pages/results';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();
let user: UserEvent;

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

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

const searchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'test',
};
jest.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => searchState,
}));

const MOCK_DATA: IndicatorDocument[] = [
  {
    indicatorID: '1',
    indicatorName: 'NHS',
    indicatorDefinition:
      'Total number of patients registered with the practice',
    earliestDataPeriod: '2021',
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
    earliestDataPeriod: '2021',
    latestDataPeriod: '2022',
    dataSource: 'Student article',
    lastUpdatedDate: new Date('November 5, 2023'),
    unitLabel: '',
    hasInequalities: true,
  },
];

const mockFormAction = jest.fn();

describe('IndicatorSelectionForm', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    user = userEvent.setup();
    searchState[SearchParams.IndicatorsSelected] = [];
  });

  it('should render search results', () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    const searchResults = screen.getAllByTestId('search-result');

    expect(searchResults).toHaveLength(MOCK_DATA.length);
    searchResults.forEach((searchResult, index) => {
      expect(searchResult).toHaveTextContent(MOCK_DATA[index].indicatorName);
      expect(searchResult).toHaveTextContent(MOCK_DATA[index].latestDataPeriod);
      expect(searchResult).toHaveTextContent(
        formatDate(new Date(MOCK_DATA[index].lastUpdatedDate))
      );
    });
    expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
  });

  it('should render no results found', () => {
    render(
      <IndicatorSelectionForm
        searchResults={[]}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    expect(screen.queryByText(/no results found/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('search-result')).toHaveLength(0);
  });

  it('should NOT render the "View data" button if no indicators found for search', async () => {
    render(
      <IndicatorSelectionForm
        searchResults={[]}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    expect(screen.queryByRole('button', { name: /View data/i })).toBeNull();
  });

  it('should render the "View data" button as disabled when there are no indicators selected in state', () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    expect(screen.getByRole('button', { name: /View data/i })).toBeDisabled();
  });

  it('should render the "View data" button as enabled when there are indicators selected in state', () => {
    searchState[SearchParams.IndicatorsSelected] = ['1'];

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    expect(screen.getByRole('button', { name: /View data/i })).toBeEnabled();
  });

  it('should render the recent trend text if the showTrends prop is passed', () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={true}
        formAction={mockFormAction}
      />
    );

    expect(
      screen.getByText('Recent trend for selected area')
    ).toBeInTheDocument();
  });

  it('should mark indicators selected as checked', () => {
    searchState[SearchParams.IndicatorsSelected] = ['1'];

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );
    expect(screen.getByRole('checkbox', { name: /NHS/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /DHSC/i })).not.toBeChecked();
  });

  it('should have appropriate direct link for each indicator regardless of checkbox state', () => {
    const expectedPaths = [
      `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[0].indicatorID.toString()}`,
      `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[1].indicatorID.toString()}`,
    ];

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    expect(
      screen.getByRole('link', { name: MOCK_DATA[0].indicatorName })
    ).toHaveAttribute('href', expectedPaths[0]);
    expect(
      screen.getByRole('link', { name: MOCK_DATA[1].indicatorName })
    ).toHaveAttribute('href', expectedPaths[1]);
  });

  it('should update the path when an indicator is checked', async () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /NHS/i }));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1#search-results-indicator-1`,
      {
        scroll: false,
      }
    );
  });

  it('should update the path when an indicator is unchecked', async () => {
    searchState[SearchParams.IndicatorsSelected] = ['1'];

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /NHS/i }));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test#search-results-indicator-1`,
      {
        scroll: false,
      }
    );
  });

  it('should call the formAction when the submit button is clicked', async () => {
    searchState[SearchParams.IndicatorsSelected] = ['1'];

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /View data/i }));

    expect(mockFormAction).toHaveBeenCalled();
  });

  it('should call setIsLoading with true when the search button is clicked', async () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('should render the "Select all" checkbox', () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    expect(
      screen.getByRole('checkbox', { name: /Select all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /Select all/i })
    ).not.toBeChecked();
  });

  it('should select all indicators when "Select all" is checked', async () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /Select all/i }));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2#search-results-indicator-all`,
      { scroll: false }
    );
  });

  it('should deselect all indicators when "Select all" is unchecked', async () => {
    searchState[SearchParams.IndicatorsSelected] = MOCK_DATA.map(
      (item) => item.indicatorID
    );

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /Select all/i }));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test#search-results-indicator-all`,
      { scroll: false }
    );
  });

  it('should call setIsLoading with true when the selectAll indicators is clicked', async () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('checkbox', { name: /Select all/i }));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('should check "Select all" checkbox if all indicators are selected', () => {
    searchState[SearchParams.IndicatorsSelected] = MOCK_DATA.map(
      (item) => item.indicatorID
    );

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    expect(screen.getByRole('checkbox', { name: /Select all/i })).toBeChecked();
  });

  it('should show sort order', () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    expect(screen.getByRole('combobox', { name: /Sort by/i })).toHaveValue(
      SortOrderKeys.relevance
    );
  });

  it('should remove indicators selected that are not available in the results', () => {
    const selectedIndicators = [MOCK_DATA[0].indicatorID, '99999', '12345'];
    searchState[SearchParams.IndicatorsSelected] = selectedIndicators;

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        showTrends={false}
        formAction={mockFormAction}
      />
    );

    const hidden: HTMLInputElement = screen.getByTestId(
      'indicators-selection-form-state'
    );
    const formState = JSON.parse(hidden.value);

    expect(formState).toHaveProperty('is', ['1']);
  });

  describe('Pagination', () => {
    beforeEach(() => {
      window.history.replaceState = jest.fn();
    });

    const generateMockSearchResults = (resultsToGenerate: number) => {
      return Array.from({ length: resultsToGenerate }, (_, index) => ({
        indicatorID: index.toString(),
        indicatorName: `Indicator ${index}`,
        indicatorDefinition: `Definition ${index}`,
        earliestDataPeriod: '2021',
        latestDataPeriod: '2023',
        dataSource: 'NHS website',
        lastUpdatedDate: new Date('December 6, 2024'),
        unitLabel: '',
        hasInequalities: false,
      }));
    };

    it('should show the pagination component when the size of the search results is more than the RESULTS_PER_PAGE', async () => {
      const totalResults = RESULTS_PER_PAGE + 1;
      const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

      render(
        <IndicatorSelectionForm
          searchResults={generateMockSearchResults(totalResults)}
          showTrends={false}
          formAction={mockFormAction}
          totalPages={totalPages}
        />
      );

      const pagination = screen.getByTestId('search-results-pagination');
      expect(pagination).toBeInTheDocument();
    });

    it('should not show the pagination component when the size of the search results is less than the RESULTS_PER_PAGE', async () => {
      const totalResults = RESULTS_PER_PAGE - 1;
      const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

      render(
        <IndicatorSelectionForm
          searchResults={generateMockSearchResults(3)}
          showTrends={false}
          formAction={mockFormAction}
          totalPages={totalPages}
        />
      );

      const pagination = screen.queryByTestId('search-results-pagination');
      expect(pagination).not.toBeInTheDocument();
    });

    it('should not show the pagination component when the size of the search results is equal to RESULTS_PER_PAGE', async () => {
      const totalResults = RESULTS_PER_PAGE;
      const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

      render(
        <IndicatorSelectionForm
          searchResults={generateMockSearchResults(totalResults)}
          showTrends={false}
          formAction={mockFormAction}
          totalPages={totalPages}
        />
      );

      const pagination = screen.queryByTestId('search-results-pagination');
      expect(pagination).not.toBeInTheDocument();
    });

    it('should show the correct number of searchResults per pages', async () => {
      const totalResults = RESULTS_PER_PAGE + 5;
      const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

      render(
        <IndicatorSelectionForm
          searchResults={generateMockSearchResults(totalResults)}
          showTrends={false}
          formAction={mockFormAction}
          totalPages={totalPages}
          currentPage={2}
        />
      );

      const resultsPerPage = screen.getAllByTestId('search-result');
      expect(resultsPerPage).toHaveLength(totalResults - RESULTS_PER_PAGE);
    });

    it('should show the pagination next page anchor and not the previous page anchor when the current page is the first page', async () => {
      const totalResults = RESULTS_PER_PAGE + 5;
      const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

      render(
        <IndicatorSelectionForm
          searchResults={generateMockSearchResults(totalResults)}
          showTrends={false}
          formAction={mockFormAction}
          totalPages={totalPages}
        />
      );

      const paginationPrevious = screen.getByText(/Previous/i).closest('li');
      expect(paginationPrevious?.className).toContain('disabled');

      const paginationNext = screen.getByText(/Next/i);
      expect(paginationNext).toBeInTheDocument();
    });

    it('should show the correct number of pages', async () => {
      const totalResults = 47;
      const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

      render(
        <IndicatorSelectionForm
          searchResults={generateMockSearchResults(totalResults)}
          showTrends={false}
          formAction={mockFormAction}
          totalPages={totalPages}
        />
      );

      const paginationContainer = screen.getByTestId(
        'search-results-pagination'
      );
      const paginationItems =
        within(paginationContainer).queryAllByRole('listitem');

      expect(paginationItems.length - 1).toEqual(totalPages);
    });

    it('should update the URL when the page is changed', async () => {
      const totalResults = RESULTS_PER_PAGE + 5;
      const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
      const currentPage = 1;
      const expectedPage = 2;
      const expectedPath = `${mockPath}?${SearchParams.SearchedIndicator}=test&${SearchParams.PageNumber}=${expectedPage}`;

      render(
        <IndicatorSelectionForm
          searchResults={generateMockSearchResults(totalResults)}
          showTrends={false}
          formAction={mockFormAction}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      );
      const paginationNext = screen.getByText(/Next/i);
      await user.click(paginationNext);

      expect(window.history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        expectedPath
      );
    });

    it('should only select indicators on the current page when "Select all" is checked', async () => {
      render(
        <IndicatorSelectionForm
          searchResults={generateMockSearchResults(20)}
          showTrends={false}
          formAction={mockFormAction}
        />
      );

      await user.click(screen.getByRole('checkbox', { name: /Select all/i }));

      const expectedSelectedIndicatorsParam = Array.from(
        { length: RESULTS_PER_PAGE },
        (_, index) => index
      ).map((index) => `${SearchParams.IndicatorsSelected}=${index}`);

      expect(mockReplace).toHaveBeenCalledWith(
        `${mockPath}?${SearchParams.SearchedIndicator}=test&${expectedSelectedIndicatorsParam.join('&')}#search-results-indicator-all`,
        { scroll: false }
      );
    });

    it('should only de-select indicators on the current page when "Select all" is unchecked', async () => {
      render(
        <IndicatorSelectionForm
          searchResults={generateMockSearchResults(20)}
          showTrends={false}
          formAction={mockFormAction}
        />
      );

      await user.click(screen.getByRole('checkbox', { name: /Select all/i }));
      await user.click(screen.getByRole('checkbox', { name: /Select all/i }));

      expect(mockReplace).toHaveBeenCalledWith(
        `${mockPath}?${SearchParams.SearchedIndicator}=test#search-results-indicator-all`,
        { scroll: false }
      );
    });

    it('Should ensure that when items are previously selected, the previously selected items are not included with all the item list', async () => {
      const mockDocuments: IndicatorDocument[] = [
        {
          indicatorID: '93474',
          indicatorName: 'NHS',
          indicatorDefinition:
            'Total number of patients registered with the practice',
          earliestDataPeriod: '2021',
          latestDataPeriod: '2023',
          dataSource: 'NHS website',
          lastUpdatedDate: new Date('December 6, 2024'),
          unitLabel: '',
          hasInequalities: false,
        },
        {
          indicatorID: '94035',
          indicatorName: 'DHSC',
          indicatorDefinition:
            'Total number of patients registered with the practice',
          earliestDataPeriod: '2021',
          latestDataPeriod: '2022',
          dataSource: 'Student article',
          lastUpdatedDate: new Date('November 5, 2023'),
          unitLabel: '',
          hasInequalities: true,
        },

        {
          indicatorID: '41101',
          indicatorName: 'DHSC with 41101',
          indicatorDefinition: 'patients registered with practice testing',
          earliestDataPeriod: '2021',
          latestDataPeriod: '2022',
          dataSource: 'Student article',
          lastUpdatedDate: new Date('November 5, 2023'),
          unitLabel: '',
          hasInequalities: true,
        },
      ];
      // pass the search indicator
      searchState[SearchParams.SearchedIndicator] = 'patient';

      render(
        <IndicatorSelectionForm
          searchResults={mockDocuments}
          showTrends={false}
          formAction={mockFormAction}
        />
      );

      // manually check the first indicator
      const firstCheckbox = screen.getAllByRole('checkbox')[1]; // Skip 'Select all'
      fireEvent.click(firstCheckbox);
      expect(firstCheckbox).toBeChecked();
      expect(mockReplace).toHaveBeenCalledWith(
        'some-mock-path?si=patient&is=93474#search-results-indicator-93474',
        { scroll: false }
      );
      mockReplace.mockReset();
      //  select all checkbox to see what happen and check it against the uri
      await user.click(screen.getByRole('checkbox', { name: /Select all/i }));
      expect(mockReplace).toHaveBeenCalledWith(
        'some-mock-path?si=patient&is=93474&is=94035&is=41101#search-results-indicator-all',
        { scroll: false }
      );
    });
  });
});
