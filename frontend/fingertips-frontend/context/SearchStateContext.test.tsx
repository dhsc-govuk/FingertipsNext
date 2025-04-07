import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchStateProvider, useSearchState } from './SearchStateContext';
import { SearchParams } from '@/lib/searchStateManager';

const TestComponent = () => {
  const { getSearchState, setSearchState } = useSearchState();

  return (
    <>
      <p data-testid="get-search-state">{`state: ${JSON.stringify(getSearchState())}`}</p>
      <button
        onClick={() =>
          setSearchState({ [SearchParams.SearchedIndicator]: 'boom' })
        }
      >
        Set search state
      </button>
    </>
  );
};

describe('SearchStateContext', () => {
  it('should have access to getSearchState prop in the TestComponent', () => {
    render(
      <SearchStateProvider>
        <TestComponent />
      </SearchStateProvider>
    );

    expect(screen.getByTestId('get-search-state')).toHaveTextContent(
      `state: ${JSON.stringify({})}`
    );
  });

  it('should call setSearchState when button is clicked and update the SearchState', async () => {
    render(
      <SearchStateProvider>
        <TestComponent />
      </SearchStateProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(screen.getByTestId('get-search-state')).toHaveTextContent(
      `state: ${JSON.stringify({
        [SearchParams.SearchedIndicator]: 'boom',
      })}`
    );
  });
});
