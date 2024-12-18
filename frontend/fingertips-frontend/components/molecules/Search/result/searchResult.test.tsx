import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SearchResult } from '.';
import { MOCK_DATA } from '@/lib/search/searchResultData';
import { registryWrapper } from '@/lib/testutils';

describe('Search Result Suite', () => {
  test('should have search result list item', () => {
    render(registryWrapper(<SearchResult result={MOCK_DATA[0]} />));

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  test('should contain 3 paragraphs and a heading', () => {
    render(registryWrapper(<SearchResult result={MOCK_DATA[0]} />));

    expect(screen.getAllByRole('paragraph')).toHaveLength(3);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('should contain expected text', () => {
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

  test('snapshot test', () => {
    const container = render(
      registryWrapper(<SearchResult result={MOCK_DATA[0]} />)
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
