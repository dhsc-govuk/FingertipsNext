import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResult } from '.';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';

let user: UserEvent;

const MOCK_DATA: IndicatorDocument[] = [
  {
    indicatorID: '1',
    indicatorName: 'NHS',
    indicatorDefinition:
      'Total number of patients registered with the practice',
    earliestDataPeriod: '1999',
    latestDataPeriod: '2023',
    dataSource: 'NHS website',
    lastUpdatedDate: new Date('December 6, 2024'),
    trend: 'Increasing and getting worse',
    hasInequalities: false,
    unitLabel: '',
  },
  {
    indicatorID: '2',
    indicatorName: 'DHSC',
    indicatorDefinition:
      'Total number of patients registered with the practice',
    earliestDataPeriod: '1999',
    latestDataPeriod: '1999',
    dataSource: 'Student article',
    lastUpdatedDate: new Date('November 5, 2023'),
    hasInequalities: true,
    unitLabel: '',
  },
];

const MOCK_DATA_LASTUPDATED_INEQUALITIES: IndicatorDocument = {
  indicatorID: '101',
  indicatorName: 'NHS',
  indicatorDefinition: 'Total number of patients registered with the practice',
  earliestDataPeriod: '1999',
  latestDataPeriod: '2023',
  dataSource: 'NHS website',
  lastUpdatedDate: new Date('December 6, 2024'),
  hasInequalities: true,
  unitLabel: '',
};

const mockHandleClick = jest.fn();

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

const mockGetSearchState = jest.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

const initialSearchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'test',
  [SearchParams.AreasSelected]: ['Area1'],
};

beforeEach(() => {
  user = userEvent.setup();
  mockGetSearchState.mockReturnValue(initialSearchState);
});

describe('content', () => {
  it('should have search result list item', () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('should contain 2 paragraphs and a heading', () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    expect(screen.getAllByRole('paragraph')).toHaveLength(2);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should contain expected text', () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    expect(screen.getByRole('heading').textContent).toContain('NHS');
    expect(screen.getAllByRole('paragraph').at(0)?.textContent).toContain(
      '2023'
    );
    expect(screen.getAllByRole('paragraph').at(1)?.textContent).toContain(
      '06 December 2024'
    );
  });

  it('should display tag if indicator date is within one month of server date', () => {
    const currentDate = new Date(MOCK_DATA[0].lastUpdatedDate);
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        handleClick={mockHandleClick}
        showTrends={false}
        currentDate={currentDate}
      />
    );
    expect(screen.queryByText('Updated in last month')).toBeInTheDocument();
  });

  it('should not display tag if indicator date is not within one month of server date', () => {
    const currentDate = new Date(MOCK_DATA[0].lastUpdatedDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(currentDate.getDate() + 1);

    render(
      <SearchResult
        result={MOCK_DATA[0]}
        handleClick={mockHandleClick}
        showTrends={false}
        currentDate={currentDate}
      />
    );

    expect(screen.queryByText('Updated in last month')).not.toBeInTheDocument();
  });

  describe('trend tag tests', () => {
    it('should display trend tags if showTrends is passed in as props', () => {
      render(
        <SearchResult
          result={MOCK_DATA[0]}
          handleClick={mockHandleClick}
          showTrends={true}
        />
      );
      expect(
        screen.queryByText('Increasing and getting worse')
      ).toBeInTheDocument();
    });

    it('should display No recent trend data available when trend is undefined for a given indicator', () => {
      render(
        <SearchResult
          result={MOCK_DATA[1]}
          handleClick={mockHandleClick}
          showTrends={true}
        />
      );
      expect(
        screen.queryByText('No recent trend data available')
      ).toBeInTheDocument();
    });
  });

  it('should display tag if inequalities data present for indicator', () => {
    const currentDate = new Date(MOCK_DATA[0].lastUpdatedDate);
    render(
      <SearchResult
        result={MOCK_DATA[1]}
        handleClick={mockHandleClick}
        showTrends={false}
        currentDate={currentDate}
      />
    );
    expect(screen.queryByText('Contains inequality data')).toBeInTheDocument();
  });

  it('should NOT display tag if inequalities data NOT present for indicator', () => {
    const currentDate = new Date(MOCK_DATA[0].lastUpdatedDate);
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        handleClick={mockHandleClick}
        showTrends={false}
        currentDate={currentDate}
      />
    );
    expect(
      screen.queryByText('Contains inequality data')
    ).not.toBeInTheDocument();
  });

  it('should show LAST UPDATE tag then INEQUALITIES tag (left to right) if both present in data', () => {
    const currentDate = new Date(
      MOCK_DATA_LASTUPDATED_INEQUALITIES.lastUpdatedDate
    );
    render(
      <SearchResult
        result={MOCK_DATA_LASTUPDATED_INEQUALITIES}
        handleClick={mockHandleClick}
        showTrends={false}
        currentDate={currentDate}
      />
    );

    const lastUpdatedElement = screen.queryByText('Updated in last month');
    const inequalitiesElement = screen.queryByText('Contains inequality data');

    expect(lastUpdatedElement).toBeInTheDocument();
    expect(inequalitiesElement).toBeInTheDocument();

    if (lastUpdatedElement && inequalitiesElement)
      // IF should always be true but check keeps the various tools happy
      expect(
        lastUpdatedElement.compareDocumentPosition(inequalitiesElement)
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('should display a range of dates if earliest data period and latest data period are different', () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    expect(
      screen.getByText('Data period:', { exact: false })
    ).toHaveTextContent(
      `Data period: ${MOCK_DATA[0].earliestDataPeriod} to ${MOCK_DATA[0].latestDataPeriod}`
    );
  });

  it('should display a single date if earliest data period and latest data period match', () => {
    render(
      <SearchResult
        result={MOCK_DATA[1]}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    expect(
      screen.getByText('Data period:', { exact: false })
    ).toHaveTextContent(`Data period: ${MOCK_DATA[1].earliestDataPeriod}`);
  });
});

describe('Indicator Checkbox', () => {
  it('should mark the checkbox as checked if indicatorSelected is true', () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        indicatorSelected={true}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should mark the checkbox as not checked if indicatorSelected is false', () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        indicatorSelected={false}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should call the provided handleClick function when checked', async () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        indicatorSelected={false}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    await user.click(screen.getByRole('checkbox'));

    expect(mockHandleClick).toHaveBeenCalledWith('1', true);
  });

  it('should call the provided handleClick function when unchecked', async () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        indicatorSelected={true}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    await user.click(screen.getByRole('checkbox'));

    expect(mockHandleClick).toHaveBeenCalledWith('1', false);
  });

  it('should have a direct link to the indicator chart', () => {
    const expectedPath = `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[0].indicatorID.toString()}&${SearchParams.AreasSelected}=${initialSearchState[SearchParams.AreasSelected]}`;
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', expectedPath);
  });

  it('should call setIsLoading with true when clicking on the direct link to the indicator chart', async () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        showTrends={false}
        handleClick={mockHandleClick}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('link'));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('snapshot test', () => {
    const container = render(
      <SearchResult
        result={MOCK_DATA[0]}
        handleClick={mockHandleClick}
        showTrends={false}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
