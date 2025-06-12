import { AuthButton } from '@/components/atoms/AuthButton';
import { Session } from 'next-auth';
import { Content, ContentItem, PositionWrapper } from './AuthHeader.styles';
import { AuthHeaderUserWidget } from './AuthHeaderUserWidget';

interface AuthHeaderProps {
  session: Session | null;
}

export function AuthHeader({ session }: AuthHeaderProps) {
  return (
    <PositionWrapper>
      <Content>
        <AuthHeaderUserWidget session={session} />
        <ContentItem>
          <AuthButton session={session} />
        </ContentItem>
      </Content>
    </PositionWrapper>
  );
}
