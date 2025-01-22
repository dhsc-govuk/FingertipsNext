import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResult } from '.';
import { userEvent } from '@testing-library/user-event';
import { SearchParams } from '@/lib/searchStateManager';
import { IndicatorSearchResult } from '@/lib/search/searchTypes';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

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

const dummyIndicatorResult: IndicatorSearchResult = {
  indicatorId: '1',
  name: 'NHS',
  definition: 'Total number of patients registered with the practice',
  latestDataPeriod: '2023',
  dataSource: 'NHS website',
  lastUpdated: new Date('December 6, 2024'),
};

afterEach(() => {
  mockReplace.mockClear();
});

it('should have search result list item', () => {
  render(<SearchResult result={dummyIndicatorResult} />);

  expect(screen.getByRole('listitem')).toBeInTheDocument();
});

it('should contain 3 paragraphs and a heading', () => {
  render(<SearchResult result={dummyIndicatorResult} />);

  expect(screen.getAllByRole('paragraph')).toHaveLength(3);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});

it('should contain expected text', () => {
  render(<SearchResult result={dummyIndicatorResult} />);

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
      <SearchResult result={dummyIndicatorResult} indicatorSelected={true} />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should mark the checkbox as not checked if indicatorSelected is false', () => {
    render(
      <SearchResult result={dummyIndicatorResult} indicatorSelected={false} />
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should update the path when an indicator is checked', async () => {
    const user = userEvent.setup();
    mockReplace.mockClear();

    render(
      <SearchResult result={dummyIndicatorResult} indicatorSelected={false} />
    );

    await user.click(screen.getByRole('checkbox'));

    expect(mockReplace).toBeCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1`,
      {
        scroll: false,
      }
    );
  });

  it('should update the path when an indicator is unchecked', async () => {
    const user = userEvent.setup();

    render(
      <SearchResult result={dummyIndicatorResult} indicatorSelected={true} />
    );

    await user.click(screen.getByRole('checkbox'));

    expect(mockReplace).toBeCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test`,
      {
        scroll: false,
      }
    );
  });

  it('should have a direct link to the indicator chart', () => {
    const expectedPath = `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${dummyIndicatorResult.indicatorId.toString()}`;
    render(<SearchResult result={dummyIndicatorResult} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', expectedPath);
  });

  it('snapshot test', () => {
    const container = render(<SearchResult result={dummyIndicatorResult} />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
