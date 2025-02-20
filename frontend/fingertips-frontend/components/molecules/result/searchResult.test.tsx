import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResult } from '.';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';

let user: UserEvent;

const MOCK_DATA: IndicatorDocument[] = [
  {
    indicatorID: '1',
    indicatorName: 'NHS',
    indicatorDefinition:
      'Total number of patients registered with the practice',
    latestDataPeriod: '2023',
    dataSource: 'NHS website',
    lastUpdatedDate: new Date('December 6, 2024'),
    associatedAreas: [],
  },
  {
    indicatorID: '2',
    indicatorName: 'DHSC',
    indicatorDefinition:
      'Total number of patients registered with the practice',
    latestDataPeriod: '2022',
    dataSource: 'Student article',
    lastUpdatedDate: new Date('November 5, 2023'),
    associatedAreas: [],
  },
];

const mockHandleClick = jest.fn();

const initialSearchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'test',
};

beforeEach(() => {
  user = userEvent.setup();
});

it('should have search result list item', () => {
  render(
    <SearchResult
      result={MOCK_DATA[0]}
      searchState={initialSearchState}
      handleClick={mockHandleClick}
    />
  );

  expect(screen.getByRole('listitem')).toBeInTheDocument();
});

it('should contain 3 paragraphs and a heading', () => {
  render(
    <SearchResult
      result={MOCK_DATA[0]}
      searchState={initialSearchState}
      handleClick={mockHandleClick}
    />
  );

  expect(screen.getAllByRole('paragraph')).toHaveLength(3);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});

it('should contain expected text', () => {
  render(
    <SearchResult
      result={MOCK_DATA[0]}
      searchState={initialSearchState}
      handleClick={mockHandleClick}
    />
  );

  expect(screen.getByRole('heading').textContent).toContain('NHS');
  expect(screen.getAllByRole('paragraph').at(0)?.textContent).toContain('2023');
  expect(screen.getAllByRole('paragraph').at(1)?.textContent).toContain(
    'NHS website'
  );
  expect(screen.getAllByRole('paragraph').at(2)?.textContent).toContain(
    '06 December 2024'
  );
});

it('should display tag if indicator date is within one month of server date', () => {
  const currentDate = new Date('December 7, 2024');
  render(
    <SearchResult
      result={MOCK_DATA[0]}
      searchState={initialSearchState}
      handleClick={mockHandleClick}
      serverDate={currentDate}
    />
  );
  expect(screen.getAllByRole('strong').at(0)?.textContent).toContain(
    'Updated in last month'
  );
});

it('should not display tag if indicator date is not within one month of server date', () => {
  const currentDate = new Date('February 6, 2025');
  render(
    <SearchResult
      result={MOCK_DATA[0]}
      searchState={initialSearchState}
      handleClick={mockHandleClick}
      serverDate={currentDate}
    />
  );

  expect(screen.queryByText('Updated in last month')).not.toBeInTheDocument();
});

describe('Indicator Checkbox', () => {
  it('should mark the checkbox as checked if indicatorSelected is true', () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        indicatorSelected={true}
        searchState={initialSearchState}
        handleClick={mockHandleClick}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should mark the checkbox as not checked if indicatorSelected is false', () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        indicatorSelected={false}
        searchState={initialSearchState}
        handleClick={mockHandleClick}
      />
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should call the provided handleClick function when checked', async () => {
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        indicatorSelected={false}
        searchState={initialSearchState}
        handleClick={mockHandleClick}
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
        searchState={initialSearchState}
        handleClick={mockHandleClick}
      />
    );

    await user.click(screen.getByRole('checkbox'));

    expect(mockHandleClick).toHaveBeenCalledWith('1', false);
  });

  it('should have a direct link to the indicator chart', () => {
    const expectedPath = `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[0].indicatorID.toString()}`;
    render(
      <SearchResult
        result={MOCK_DATA[0]}
        searchState={initialSearchState}
        handleClick={mockHandleClick}
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', expectedPath);
  });

  it('snapshot test', () => {
    const container = render(
      <SearchResult
        result={MOCK_DATA[0]}
        searchState={initialSearchState}
        handleClick={mockHandleClick}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
