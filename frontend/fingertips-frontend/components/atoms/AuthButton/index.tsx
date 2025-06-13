import { Session } from 'next-auth';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';

interface authButtonProps {
  session: Session | null;
  signInHandler: () => Promise<void>;
  signOutHandler: () => Promise<void>;
}

export function AuthButton({
  session,
  signInHandler,
  signOutHandler,
}: authButtonProps) {
  return session ? (
    <SignOutButton signOutHandler={signOutHandler} />
  ) : (
    <SignInButton signInHandler={signInHandler} />
  );
}
