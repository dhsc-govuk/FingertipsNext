import { Session } from 'next-auth';
import { signOutHandler, signInHandler } from '@/lib/auth/handlers';
import { ButtonText, InvisibleButton } from './AuthButton.styles';

interface AuthButtonProps {
  session?: Session;
}

export function AuthButton({ session }: Readonly<AuthButtonProps>) {
  return session ? <SignOutButton /> : <SignInButton />;
}

function SignInButton() {
  return (
    <InvisibleButton onClick={signInHandler}>
      <ButtonText>Sign in</ButtonText>
    </InvisibleButton>
  );
}

function SignOutButton() {
  return (
    <InvisibleButton onClick={signOutHandler}>
      <ButtonText>Sign out</ButtonText>
    </InvisibleButton>
  );
}
