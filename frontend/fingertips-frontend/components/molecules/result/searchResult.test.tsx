import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResult } from '.';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { SearchParams } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();
let user: UserEvent;

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => ({ [SearchParams.SearchedIndicator]: 'test' }),
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const MOCK_DATA: IndicatorDocument[] = [
  {
    indicatorID: '1',
    name: 'NHS',
    definition: 'Total number of patients registered with the practice',
    latestDataPeriod: '2023',
    dataSource: 'NHS website',
    lastUpdatedDate: new Date('December 6, 2024'),
  },
  {
    indicatorID: '2',
    name: 'DHSC',
    definition: 'Total number of patients registered with the practice',
    latestDataPeriod: '2022',
    dataSource: 'Student article',
    lastUpdatedDate: new Date('November 5, 2023'),
  },
];

beforeEach(() => {
  mockReplace.mockClear();
  user = userEvent.setup();
});

it('should have search result list item', () => {
  render(<SearchResult result={MOCK_DATA[0]} />);

  expect(screen.getByRole('listitem')).toBeInTheDocument();
});

it('should contain 3 paragraphs and a heading', () => {
  render(<SearchResult result={MOCK_DATA[0]} />);

  expect(screen.getAllByRole('paragraph')).toHaveLength(3);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});

it('should contain expected text', () => {
  render(<SearchResult result={MOCK_DATA[0]} />);

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
    render(<SearchResult result={MOCK_DATA[0]} indicatorSelected={true} />);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should mark the checkbox as not checked if indicatorSelected is false', () => {
    render(<SearchResult result={MOCK_DATA[0]} indicatorSelected={false} />);

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should update the path when an indicator is checked', async () => {
    render(<SearchResult result={MOCK_DATA[0]} indicatorSelected={false} />);

    await user.click(screen.getByRole('checkbox'));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1`,
      {
        scroll: false,
      }
    );
  });

  it('should update the path when an indicator is unchecked', async () => {
    render(<SearchResult result={MOCK_DATA[0]} indicatorSelected={true} />);

    await user.click(screen.getByRole('checkbox'));

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test`,
      {
        scroll: false,
      }
    );
  });

  it('should have a direct link to the indicator chart', () => {
    const expectedPath = `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[0].indicatorId.toString()}`;
    render(<SearchResult result={MOCK_DATA[0]} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', expectedPath);
  });

  it('snapshot test', () => {
    const container = render(<SearchResult result={MOCK_DATA[0]} />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
