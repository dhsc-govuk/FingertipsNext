import { Session } from 'next-auth';
import { signOutHandler, signInHandler } from '@/lib/auth/handlers';
import { StyledAuthButton } from './AuthButton.styles';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';

interface AuthButtonProps {
  session?: Session;
}

export function AuthButton({ session }: Readonly<AuthButtonProps>) {
  return session ? <SignOutButton /> : <SignInButton />;
}

function SignInButton() {
  useEffect(() => {
    getSession();
  }, []);
  return (
    <StyledAuthButton data-testid="sign-in-button" onClick={signInHandler}>
      Sign in
    </StyledAuthButton>
  );
}

function SignOutButton() {
  return (
    <StyledAuthButton data-testid="sign-out-button" onClick={signOutHandler}>
      Sign out
    </StyledAuthButton>
  );
}
