import { Session } from 'next-auth';
import { signOutHandler, signInHandler } from '@/lib/authService/authHandlers';
import { ButtonText, InvisibleButton } from './AuthButton.styles';

interface authButtonProps {
  session?: Session;
}

export function AuthButton({ session }: authButtonProps) {
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
