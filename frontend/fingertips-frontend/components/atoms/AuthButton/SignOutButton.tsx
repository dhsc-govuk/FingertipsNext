import { GovukColours } from '@/lib/styleHelpers/colours';
import { StyledButton } from './AuthButton.styles';

interface signOutButtonProps {
  signOutHandler: () => Promise<void>;
}

export function SignOutButton({ signOutHandler }: signOutButtonProps) {
  return (
    <form action={signOutHandler}>
      <StyledButton buttonColour={GovukColours.Black}>Sign out</StyledButton>
    </form>
  );
}
