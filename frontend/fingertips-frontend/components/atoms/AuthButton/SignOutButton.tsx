import { GovukColours } from '@/lib/styleHelpers/colours';
import { StyledButton } from './AuthButton.styles';
import { signOutHandler } from '@/lib/authService/authHandlers';

export function SignOutButton() {
  return (
    <form action={signOutHandler}>
      <StyledButton buttonColour={GovukColours.Black}>Sign out</StyledButton>
    </form>
  );
}
