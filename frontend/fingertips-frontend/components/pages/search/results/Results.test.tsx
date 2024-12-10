import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { MOCK_DATA } from '@/app/search/results/search-result-data';
import SearchResults from '.';

describe('Search Results Suite', () => {
  test('should render elements', async () => {
    const indicator = 'test';
    render(<SearchResults indicator={indicator} searchResults={[]} />);

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText(/search results/i)).toBeInTheDocument();
    expect(screen.getAllByRole('paragraph').at(0)?.textContent).toContain(
      indicator
    );
  });

  test('should render search results', () => {
    render(<SearchResults indicator="" searchResults={MOCK_DATA} />);

    expect(screen.getAllByTestId('search-result')).toHaveLength(
      MOCK_DATA.length
    );
    expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
  });

  test('should render no results found', () => {
    render(<SearchResults indicator="" searchResults={[]} />);

    expect(screen.queryByText(/no results found/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('search-result')).toHaveLength(0);
  });

  test('snapshot test', () => {
    const container = render(
      <SearchResults indicator="" searchResults={MOCK_DATA} />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
