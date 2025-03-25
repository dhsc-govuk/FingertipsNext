import { render, screen } from '@testing-library/react';
import { IndicatorSelectionForm } from '.';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { formatDate } from '@/lib/dateHelpers/dateHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { LoaderContext } from '@/context/LoaderContext';

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
  isLoading: false,
  setIsLoading: mockSetIsLoading,
};

jest.mock('@/context/LoaderContext', () => {
  return {
    useLoader: () => mockLoaderContext,
  };
});

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
    associatedAreaCodes: [],
    unitLabel: '',
    hasInequalities: false,
    usedInPoc: true,
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
    associatedAreaCodes: [],
    unitLabel: '',
    hasInequalities: true,
    usedInPoc: true,
  },
];

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'test',
};

const mockFormAction = jest.fn();

describe('IndicatorSelectionForm', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    user = userEvent.setup();
  });

  it('should render search results', () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={state}
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
        searchState={state}
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
        searchState={state}
        formAction={mockFormAction}
      />
    );

    expect(screen.queryByRole('button', { name: /View data/i })).toBeNull();
  });

  it('should render the "View data" button as disabled when there are no indicators selected in state', () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={state}
        formAction={mockFormAction}
      />
    );

    expect(screen.getByRole('button', { name: /View data/i })).toBeDisabled();
  });

  it('should render the "View data" button as enabled when there are indicators selected in state', () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={{
          ...state,
          [SearchParams.IndicatorsSelected]: ['1'],
        }}
        formAction={mockFormAction}
      />
    );

    expect(screen.getByRole('button', { name: /View data/i })).toBeEnabled();
  });

  it('should mark indicators selected as checked', () => {
    const stateWithIndicatorSelected = {
      ...state,
      [SearchParams.IndicatorsSelected]: ['1'],
    };

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={stateWithIndicatorSelected}
        formAction={mockFormAction}
      />
    );
    expect(screen.getByRole('checkbox', { name: /NHS/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /DHSC/i })).not.toBeChecked();
  });

  it('should have appropriate direct link for each indicator regardless of checkbox state', () => {
    const expectedPaths = [
      `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[0].indicatorID.toString()}&${SearchParams.AreasSelected}=${areaCodeForEngland}`,
      `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[1].indicatorID.toString()}&${SearchParams.AreasSelected}=${areaCodeForEngland}`,
    ];

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={state}
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
        searchState={state}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /NHS/i }));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1`,
      {
        scroll: false,
      }
    );
  });

  it('should update the path when an indicator is unchecked', async () => {
    const stateWithIndicatorSelected = {
      ...state,
      [SearchParams.IndicatorsSelected]: ['1'],
    };

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={stateWithIndicatorSelected}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /NHS/i }));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test`,
      {
        scroll: false,
      }
    );
  });

  it('should call the formAction when the submit button is clicked', async () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={{
          ...state,
          [SearchParams.IndicatorsSelected]: ['1'],
        }}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /View data/i }));

    expect(mockFormAction).toHaveBeenCalled();
  });

  it('should call setIsLoading to true when the search button is clicked', async () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={state}
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
        searchState={state}
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
        searchState={state}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /Select all/i }));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`,
      { scroll: false }
    );
  });

  it('should deselect all indicators when "Select all" is unchecked', async () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={{
          ...state,
          [SearchParams.IndicatorsSelected]: MOCK_DATA.map(
            (item) => item.indicatorID
          ),
        }}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /Select all/i }));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test`,
      { scroll: false }
    );
  });

  it('should check "Select all" checkbox if all indicators are selected', () => {
    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={{
          ...state,
          [SearchParams.IndicatorsSelected]: MOCK_DATA.map(
            (item) => item.indicatorID
          ),
        }}
        formAction={mockFormAction}
      />
    );

    expect(screen.getByRole('checkbox', { name: /Select all/i })).toBeChecked();
  });
});
