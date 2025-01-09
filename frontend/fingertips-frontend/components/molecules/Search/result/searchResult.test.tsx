import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResult } from '.';
import { MOCK_DATA } from '@/app/search/results/search-result-data';
import { registryWrapper } from '@/lib/testutils';
import { userEvent } from '@testing-library/user-event';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => ({ indicator: 'test' }),
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

describe('Search Result Suite', () => {
  it('should have search result list item', () => {
    render(registryWrapper(<SearchResult result={MOCK_DATA[0]} />));

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('should contain 3 paragraphs and a heading', () => {
    render(registryWrapper(<SearchResult result={MOCK_DATA[0]} />));

    expect(screen.getAllByRole('paragraph')).toHaveLength(3);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should contain expected text', () => {
    render(registryWrapper(<SearchResult result={MOCK_DATA[0]} />));

    expect(screen.getByRole('heading').textContent).toContain('NHS');
    expect(screen.getAllByRole('paragraph').at(0)?.textContent).toContain(
      '2023'
    );
    expect(screen.getAllByRole('paragraph').at(1)?.textContent).toContain(
      'NHS website'
    );
    expect(screen.getAllByRole('paragraph').at(2)?.textContent).toContain(
      '06 December 2024'
    );
  });

  it('should mark the checkbox as checked if indicatorSelected is true', () => {
    render(
      registryWrapper(
        <SearchResult result={MOCK_DATA[0]} indicatorSelected={true} />
      )
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should mark the checkbox as not checked if indicatorSelected is false', () => {
    render(
      registryWrapper(
        <SearchResult result={MOCK_DATA[0]} indicatorSelected={false} />
      )
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should update the path when an indicator is checked', async () => {
    const user = userEvent.setup();

    render(<SearchResult result={MOCK_DATA[0]} indicatorSelected={false} />);

    await user.click(screen.getByRole('checkbox'));

    expect(mockReplace).toBeCalledWith(
      `${mockPath}?indicator=test&indicatorsSelected=1`,
      {
        scroll: false,
      }
    );
  });

  it('should update the path when an indicator is unchecked', async () => {
    const user = userEvent.setup();

    render(<SearchResult result={MOCK_DATA[0]} indicatorSelected={true} />);

    await user.click(screen.getByRole('checkbox'));

    expect(mockReplace).toBeCalledWith(`${mockPath}?indicator=test`, {
      scroll: false,
    });
  });

  it('snapshot test', () => {
    const container = render(
      registryWrapper(<SearchResult result={MOCK_DATA[0]} />)
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
