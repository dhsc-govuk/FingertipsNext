// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
//
import { render } from '@testing-library/react';
import { AuthHeader } from '.';
import { signInHandler, signOutHandler } from '@/lib/auth/handlers';
import userEvent from '@testing-library/user-event';
import { mockSession } from '@/mock/utils/mockAuth';

vi.mock('next-auth/react', () => {
  return { getSession: vi.fn() };
});

vi.mock('@/lib/auth/handlers', () => {
  return {
    signInHandler: vi.fn(),
    signOutHandler: vi.fn(),
  };
});

mockSetIsLoading.mockReturnValue(false);

describe('auth header', () => {
  it('should render a sign in button if session is undefined', () => {
    const screen = render(<AuthHeader session={undefined} />);

    expect(screen.queryByTestId('auth-user-info')).not.toBeInTheDocument();

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign in');
  });

  it('should call the sign in handler when the "Sign in" button is clicked', async () => {
    const screen = render(<AuthHeader session={undefined} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(signInHandler).toHaveBeenCalled();
  });

  it('should render a sign out button if session is not null', () => {
    const screen = render(<AuthHeader session={mockSession()} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign out');
    expect(screen.getByTestId('sign-out-button')).toBeInTheDocument();
  });

  it('should call the sign out handler when the "Sign out" button is clicked', async () => {
    const screen = render(<AuthHeader session={mockSession()} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(signOutHandler).toHaveBeenCalled();
  });
});
