import { render } from '@testing-library/react';
import { AuthHeader } from '.';
import userEvent from '@testing-library/user-event';

// unexpected token issue
describe('auth header', () => {
  it('should render nothing if no auth props provided', () => {
    const screen = render(<AuthHeader />);

    expect(screen.container).toBeEmptyDOMElement();
  });

  it('should render a sign in button and no user info widget if session is null', async () => {
    const screen = render(<AuthHeader />);

    expect(screen.queryByTestId('auth-user-info')).not.toBeInTheDocument();

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign in');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    // expect(mockSignInHandler).toHaveBeenCalled();
  });

  it('should render a sign out button and a user info widget if session is not null', async () => {
    const screen = render(
      <AuthHeader session={{ expires: '', user: { name: 'AzureDiamond' } }} />
    );

    expect(screen.getByTestId('auth-user-info')).toBeInTheDocument();
    expect(screen.getByTestId('auth-user-info')).toHaveTextContent(
      'AzureDiamond'
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign out');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    // expect(mockSignOutHandler).toHaveBeenCalled();
  });
});
