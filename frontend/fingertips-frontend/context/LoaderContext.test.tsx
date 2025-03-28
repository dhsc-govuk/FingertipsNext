import { render, screen } from '@testing-library/react';
import { LoaderProvider, useLoadingState } from './LoaderContext';
import userEvent from '@testing-library/user-event';
import { SearchStateContext } from './SearchStateContext';

const mockPath = 'some-mock-path';
jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
  };
});

const mockGetSearchState = jest.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

const TestComponent = () => {
  const { getIsLoading, setIsLoading } = useLoadingState();

  return (
    <>
      <p data-testid="is-loaded">{`Loading: ${getIsLoading()}`}</p>
      <button onClick={() => setIsLoading(true)}>Set loading</button>
    </>
  );
};

describe('LoaderContext', () => {
  it('should have access to getIsLoading prop in the TestComponent', () => {
    mockGetSearchState.mockReturnValue({});

    render(
      <LoaderProvider>
        <TestComponent />
      </LoaderProvider>
    );

    expect(screen.getByTestId('is-loaded')).toHaveTextContent('Loading: false');
  });

  it('should call setIsLoading when button is clicked and update the getIsLoaded value', async () => {
    render(
      <LoaderProvider>
        <TestComponent />
      </LoaderProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(screen.getByTestId('is-loaded')).toHaveTextContent('Loading: true');
  });
});
