import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import SearchResult from '.';
import {
  SearchResultInterface,
  MOCK_DATA,
} from '@/app/search/results/search-result-data';

describe('Search Result Suite', () => {
  test('should have search result list item', () => {
    const result: SearchResultInterface = MOCK_DATA[0];

    render(<SearchResult result={result} />);

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  test('should contain 3 paragraphs and a heading', () => {
    const result: SearchResultInterface = MOCK_DATA[0];

    render(<SearchResult result={result} />);

    expect(screen.getAllByRole('paragraph')).toHaveLength(3);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('should contain expected text', () => {
    const result: SearchResultInterface = MOCK_DATA[0];

    render(<SearchResult result={result} />);

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

  test('snapshot test', () => {
    const result: SearchResultInterface = MOCK_DATA[0];

    const container = render(<SearchResult result={result} />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
