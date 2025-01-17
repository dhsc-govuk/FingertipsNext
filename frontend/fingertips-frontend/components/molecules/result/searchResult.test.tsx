import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResult } from '.';
import { MOCK_DATA } from '@/app/results/search-result-data';
import { userEvent } from '@testing-library/user-event';
import { SearchParams } from '@/lib/searchStateManager';

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

afterEach(() => {
  mockReplace.mockClear();
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
    const user = userEvent.setup();
    mockReplace.mockClear();

    render(<SearchResult result={MOCK_DATA[0]} indicatorSelected={false} />);

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

    render(<SearchResult result={MOCK_DATA[0]} indicatorSelected={true} />);

    await user.click(screen.getByRole('checkbox'));

    expect(mockReplace).toBeCalledWith(
      `${mockPath}?${SearchParams.SearchedIndicator}=test`,
      {
        scroll: false,
      }
    );
  });

  it('should have a direct link to the indicator chart', () => {
    const expectedPath = `/chart?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=${MOCK_DATA[0].id.toString()}`;
    render(<SearchResult result={MOCK_DATA[0]} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', expectedPath);
  });

  it('snapshot test', () => {
    const container = render(<SearchResult result={MOCK_DATA[0]} />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
