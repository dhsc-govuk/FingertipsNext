import { GovukColours } from '@/lib/styleHelpers/colours';
import { StyledButton } from './AuthButton.styles';

interface signInButtonProps {
  signInHandler: () => Promise<void>;
}

export function SignInButton({ signInHandler }: signInButtonProps) {
  return (
    <form action={signInHandler}>
      <StyledButton buttonColour={GovukColours.Black}>Sign in</StyledButton>
    </form>
  );
}
