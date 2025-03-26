import { render, screen } from '@testing-library/react';
import { LoaderProvider, useLoader } from './LoaderContext';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
  const { getIsLoading, setIsLoading } = useLoader();

  return (
    <>
      <p data-testid="is-loaded">{`Loading: ${getIsLoading()}`}</p>
      <button onClick={() => setIsLoading(false)}>Set loading</button>
    </>
  );
};

describe('LoaderContext', () => {
  it('should have access to getIsLoading prop in the TestComponent', () => {
    render(
      <LoaderProvider>
        <TestComponent />
      </LoaderProvider>
    );

    expect(screen.getByTestId('is-loaded')).toHaveTextContent('Loading: true');
  });

  it('should call setIsLoading when button is clicked and updated the getIsLoaded value', async () => {
    render(
      <LoaderProvider>
        <TestComponent />
      </LoaderProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(screen.getByTestId('is-loaded')).toHaveTextContent('Loading: false');
  });
});
