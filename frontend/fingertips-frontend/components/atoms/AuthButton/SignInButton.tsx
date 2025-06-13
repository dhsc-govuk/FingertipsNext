import { GovukColours } from '@/lib/styleHelpers/colours';
import { StyledButton } from './AuthButton.styles';
import { signInHandler } from '@/lib/authService/authHandlers';

export function SignInButton() {
  return (
    <form action={signInHandler}>
      <StyledButton buttonColour={GovukColours.Black}>Sign in</StyledButton>
    </form>
  );
}
