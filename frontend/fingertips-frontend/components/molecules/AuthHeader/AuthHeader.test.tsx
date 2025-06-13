import { render } from '@testing-library/react';
import { AuthHeader } from '.';
import userEvent from '@testing-library/user-event';

const mockSignInHandler = jest.fn();
const mockSignOutHandler = jest.fn();

beforeEach(jest.clearAllMocks);

describe('auth header', () => {
  it('should render nothing if no auth props provided', () => {
    const screen = render(<AuthHeader />);

    expect(screen.container).toBeEmptyDOMElement();
  });

  it('should render a sign in button and no user info widget if session is null', async () => {
    const screen = render(
      <AuthHeader
        auth={{
          session: null,
          signInHandler: mockSignInHandler,
          signOutHandler: mockSignOutHandler,
        }}
      />
    );

    expect(screen.queryByTestId('auth-user-info')).not.toBeInTheDocument();

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign in');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(mockSignInHandler).toHaveBeenCalled();
  });

  it('should render a sign out button and a user info widget if session is not null', async () => {
    const screen = render(
      <AuthHeader
        auth={{
          session: { expires: '', user: { name: 'AzureDiamond' } },
          signInHandler: mockSignInHandler,
          signOutHandler: mockSignOutHandler,
        }}
      />
    );

    expect(screen.getByTestId('auth-user-info')).toBeInTheDocument();
    expect(screen.getByTestId('auth-user-info')).toHaveTextContent(
      'AzureDiamond'
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign out');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(mockSignOutHandler).toHaveBeenCalled();
  });
});
