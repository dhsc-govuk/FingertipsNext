import { GovukColours } from '@/lib/styleHelpers/colours';
import { Paragraph } from 'govuk-react';
import { Session, User } from 'next-auth';
import styled from 'styled-components';

interface authStatusWidgetProps {
  session: Session | null;
}

const StyledParagraph = styled(Paragraph)({
  color: GovukColours.White,
  margin: 0,
  padding: '7px',
  display: 'inline-block',
});

export function AuthStatusWidget({ session }: authStatusWidgetProps) {
  return session?.user ? (
    <div>
      <UserName user={session.user} />
      <UserImage />
    </div>
  ) : null;
}

interface UserWidgetProps {
  user?: User;
}

function UserName({ user }: UserWidgetProps) {
  return user?.name ? (
    <StyledParagraph>{`**${user.name}**`}</StyledParagraph>
  ) : null;
}

function UserImage() {
  return <StyledParagraph>☺</StyledParagraph>;
}
