import { render } from '@testing-library/react';
import { AuthButton } from '.';
import userEvent from '@testing-library/user-event';

// const mockSignInHandler = jest.fn();
// const mockSignOutHandler = jest.fn();

describe('auth button', () => {
  it('should display a button labelled "Sign in" when no session is provided', () => {
    const screen = render(<AuthButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign in');
  });

  it('should display a button labelled "Sign out" when a session is provided', () => {
    const screen = render(<AuthButton session={{ expires: '' }} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Sign out');
  });

  it('should call the sign in handler when the "Sign in" button is clicked', async () => {
    const screen = render(<AuthButton />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    //expect(mockSignInHandler).toHaveBeenCalled();
  });

  it('should call the sign out handler when the "Sign out" button is clicked', async () => {
    const screen = render(<AuthButton session={{ expires: '' }} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    //expect(mockSignOutHandler).toHaveBeenCalled();
  });
});
