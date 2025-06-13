import { User } from 'next-auth';
import { StyledParagraph } from './UserStatusWidget.styles';

interface userStatusWidgetProps {
  user?: User;
}

export function UserStatusWidget({ user }: userStatusWidgetProps) {
  return user ? (
    <div>
      <UserName user={user} />
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

// to be removed/extended once design finalised on handling user images
function UserImage() {
  return <StyledParagraph>☺</StyledParagraph>;
}
