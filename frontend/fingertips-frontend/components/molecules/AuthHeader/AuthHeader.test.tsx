import { render } from '@testing-library/react';
import { AuthHeader } from '.';
import { signInHandler, signOutHandler } from '@/lib/authService/authHandlers';
import userEvent from '@testing-library/user-event';

vi.mock('@/lib/authService/authHandlers', () => {
  return {
    signInHandler: vi.fn(),
    signOutHandler: vi.fn(),
  };
});

// unexpected token issue
describe('auth header', () => {
  it('should render a sign in button if session is null', async () => {
    const screen = render(<AuthHeader session={undefined} />);

    expect(screen.queryByTestId('auth-user-info')).not.toBeInTheDocument();

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign in');
  });

  it('should call the sign in handler when the "Sign in" button is clicked', async () => {
    const screen = render(<AuthHeader session={undefined} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(signInHandler).toHaveBeenCalled();
  });

  it('should render a sign out button if session is not null', async () => {
    const screen = render(<AuthHeader session={{ expires: '' }} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign out');
  });

  it('should call the sign out handler when the "Sign out" button is clicked', async () => {
    const screen = render(<AuthHeader session={{ expires: '' }} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(signOutHandler).toHaveBeenCalled();
  });
});
