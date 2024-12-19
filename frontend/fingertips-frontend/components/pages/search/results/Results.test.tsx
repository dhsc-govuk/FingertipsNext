import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { MOCK_DATA } from '@/app/search/results/search-result-data';
import { SearchResults } from '.';
import { registryWrapper } from '@/lib/testutils';

describe('Search Results Suite', () => {
  const indicator = 'test';

  it('should render elements', async () => {
    render(
      registryWrapper(
        <SearchResults indicator={indicator} searchResults={[]} />
      )
    );

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText(/search results/i)).toBeInTheDocument();
    expect(screen.getAllByRole('paragraph').at(0)?.textContent).toContain(
      indicator
    );
  });

  it('should render search results', () => {
    render(
      registryWrapper(
        <SearchResults indicator={indicator} searchResults={MOCK_DATA} />
      )
    );

    expect(screen.getAllByTestId('search-result')).toHaveLength(
      MOCK_DATA.length
    );
    expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
  });

  it('should not render elements when no indicator is entered', () => {
    render(
      registryWrapper(<SearchResults indicator="" searchResults={MOCK_DATA} />)
    );

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText(/no indicator entered/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('search-result')).toHaveLength(0);
  });

  it('should render no results found', () => {
    render(
      registryWrapper(
        <SearchResults indicator={indicator} searchResults={[]} />
      )
    );

    expect(screen.queryByText(/no results found/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('search-result')).toHaveLength(0);
  });

  it('should mark indicators selected as checked', () => {
    render(
      registryWrapper(
        <SearchResults
          indicator={indicator}
          searchResults={MOCK_DATA}
          indicatorsSelected={['1']}
        />
      )
    );

    expect(screen.getByRole('checkbox', { name: /NHS/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /DHSC/i })).not.toBeChecked();
  });

  it('snapshot test', () => {
    const container = render(
      registryWrapper(
        <SearchResults indicator={indicator} searchResults={MOCK_DATA} />
      )
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
