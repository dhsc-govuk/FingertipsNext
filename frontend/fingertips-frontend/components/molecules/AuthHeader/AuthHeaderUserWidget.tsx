import { AuthStatusWidget } from '@/components/atoms/AuthStatusWidget';
import { ContentItem } from './AuthHeader.styles';
import { Session } from 'next-auth';

interface AuthHeaderUserWidgetProps {
  session: Session | null;
}

export function AuthHeaderUserWidget({ session }: AuthHeaderUserWidgetProps) {
  return session ? (
    <ContentItem>
      <AuthStatusWidget session={session} />
    </ContentItem>
  ) : null;
}
