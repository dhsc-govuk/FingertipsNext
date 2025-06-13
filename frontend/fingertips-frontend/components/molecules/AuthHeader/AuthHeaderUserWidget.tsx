import { UserStatusWidget } from '@/components/atoms/UserStatusWidget';
import { ContentItem } from './AuthHeader.styles';
import { Session } from 'next-auth';

interface AuthHeaderUserWidgetProps {
  session: Session | null;
}

export function AuthHeaderUserWidget({ session }: AuthHeaderUserWidgetProps) {
  return session ? (
    <ContentItem>
      <div data-testid={'auth-user-info'}>
        <UserStatusWidget user={session.user} />
      </div>
    </ContentItem>
  ) : null;
}
