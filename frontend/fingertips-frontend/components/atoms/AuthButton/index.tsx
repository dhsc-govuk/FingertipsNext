import { Session } from 'next-auth';
import { signInHandler, signOutHandler } from '@/lib/auth/handlers';
import { StyledAuthButton } from './AuthButton.styles';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useLoadingState } from '@/context/LoaderContext';
// import { useRouter } from 'next/navigation';
interface AuthButtonProps {
  session?: Session;
}

export function AuthButton({ session }: Readonly<AuthButtonProps>) {
  return session ? <SignOutButton /> : <SignInButton />;
}

function SignInButton() {
  // refresh the session in SessionProvider
  // to trigger rerender of chart/Page
  useEffect(() => {
    getSession();
  }, []);
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
        const returnTo = encodeURI(String(window.location.origin));
        signOutHandler(returnTo);
      }}
    >
      Sign out
    </StyledAuthButton>
  );
}
