import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResult } from '.';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';

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

const mockHandleClick = jest.fn();

const initialSearchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'test',
};

beforeEach(() => {
  mockReplace.mockClear();
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
    const expectedPath = `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[0].indicatorId.toString()}`;
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
