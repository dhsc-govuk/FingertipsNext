import { Session } from 'next-auth';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';

interface authButtonProps {
  session?: Session;
}

export function AuthButton({ session }: authButtonProps) {
  return session ? <SignOutButton /> : <SignInButton />;
}
