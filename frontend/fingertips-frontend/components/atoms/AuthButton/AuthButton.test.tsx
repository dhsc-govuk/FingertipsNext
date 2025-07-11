import { render } from '@testing-library/react';
import { AuthButton } from '.';
import userEvent from '@testing-library/user-event';
import { signInHandler, signOutHandler } from '@/lib/auth/handlers';

vi.mock('@/lib/auth/handlers', () => {
  return {
    signInHandler: vi.fn(),
    signOutHandler: vi.fn(),
  };
});

describe('auth button', () => {
  beforeEach(vi.clearAllMocks);

  it('should display a button labelled "Sign in" when no session is provided', () => {
    const screen = render(<AuthButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign in');
  });

  it.skip('should display a button labelled "Sign in" when past expires session is provided', () => {
    const pastTime = Date.now() - 60 * 60 * 1000; // 1 hour ago
    const screen = render(
      <AuthButton session={{ expires: String(pastTime) }} />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign in');
  });

  it('should display a button labelled "Sign out" when a session is provided', () => {
    const screen = render(<AuthButton session={{ expires: '' }} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-out-button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign out');
  });

  it('should call the sign in handler when the "Sign in" button is clicked', async () => {
    const screen = render(<AuthButton />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(signInHandler).toHaveBeenCalled();
  });

  it('should call the sign out handler when the "Sign out" button is clicked', async () => {
    const screen = render(<AuthButton session={{ expires: '' }} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(signOutHandler).toHaveBeenCalled();
  });
});
