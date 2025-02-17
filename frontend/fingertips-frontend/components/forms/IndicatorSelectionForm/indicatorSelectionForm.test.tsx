import { render, screen } from '@testing-library/react';
import { IndicatorSelectionForm } from '.';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { formatDate } from '@/components/molecules/result';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorSelectionState } from '@/components/forms/IndicatorSelectionForm/indicatorSelectionActions';
import { UserEvent, userEvent } from '@testing-library/user-event';

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

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'test',
};

const mockFormAction = jest.fn();

const initialState: IndicatorSelectionState = {
  searchState: JSON.stringify(state),
  indicatorsSelected: [],
  message: null,
};
const initialStateIndicatorSelected = {
  ...initialState,
  indicatorsSelected: ['1'],
};

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
      expect(searchResult).toHaveTextContent(MOCK_DATA[index].name);
      expect(searchResult).toHaveTextContent(MOCK_DATA[index].latestDataPeriod);
      expect(searchResult).toHaveTextContent(MOCK_DATA[index].dataSource);
      expect(searchResult).toHaveTextContent(
        formatDate(new Date(MOCK_DATA[index].lastUpdated))
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
      `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[0].indicatorId.toString()}`,
      `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[1].indicatorId.toString()}`,
    ];

    render(
      <IndicatorSelectionForm
        searchResults={MOCK_DATA}
        searchState={state}
        formAction={mockFormAction}
      />
    );

    expect(
      screen.getByRole('link', { name: MOCK_DATA[0].name })
    ).toHaveAttribute('href', expectedPaths[0]);
    expect(
      screen.getByRole('link', { name: MOCK_DATA[1].name })
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
        searchState={state}
        formAction={mockFormAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /View charts/i }));

    const formData = new FormData();
    formData.append(
      'searchState',
      JSON.stringify(initialStateIndicatorSelected)
    );
    formData.append('indicatorsSelected', '1');

    expect(mockFormAction).toHaveBeenCalled();
  });
});
