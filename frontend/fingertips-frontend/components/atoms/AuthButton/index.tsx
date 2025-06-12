import { Button } from 'govuk-react';
import { Session } from 'next-auth';
import { signInHandler, signOutHandler } from './authButtonHandlers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';

interface authButtonProps {
  session: Session | null;
}

const StyledButton = styled(Button)({
  margin: 0,
});

export function AuthButton({ session }: authButtonProps) {
  if (!session) {
    return (
      <form action={signInHandler}>
        <StyledButton buttonColour={GovukColours.Black}>Sign in</StyledButton>
      </form>
    );
  } else
    return (
      <div>
        <form action={signOutHandler}>
          <StyledButton buttonColour={GovukColours.Black}>
            Sign out
          </StyledButton>
        </form>
      </div>
    );
}
