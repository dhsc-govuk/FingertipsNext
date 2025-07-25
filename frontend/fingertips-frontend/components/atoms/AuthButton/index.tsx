import { Session } from 'next-auth';
import { signOutHandler, signInHandler } from '@/lib/auth/handlers';
import { StyledAuthButton } from './AuthButton.styles';
import { useEffect } from 'react';
import { useLoadingState } from '@/context/LoaderContext';
interface AuthButtonProps {
  session?: Session;
}

export function AuthButton({ session }: Readonly<AuthButtonProps>) {
  return session ? <SignOutButton /> : <SignInButton />;
}

function SignInButton() {
  const { setIsLoading } = useLoadingState();

  return (
    <StyledAuthButton
      data-testid="sign-in-button"
      onClick={() => {
        setIsLoading(true);
        signInHandler();
      }}
    >
      Sign in
    </StyledAuthButton>
  );
}

function SignOutButton() {
  const { setIsLoading } = useLoadingState();
  useEffect(() => {
    setIsLoading(false);
  });

  return (
    <StyledAuthButton
      data-testid="sign-out-button"
      onClick={() => {
        setIsLoading(true);
        signOutHandler();
      }}
    >
      Sign out
    </StyledAuthButton>
  );
}
