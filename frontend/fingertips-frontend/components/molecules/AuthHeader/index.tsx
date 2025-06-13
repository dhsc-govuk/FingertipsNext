import { AuthButton } from '@/components/atoms/AuthButton';
import { Content, ContentItem, PositionWrapper } from './AuthHeader.styles';
import { AuthHeaderUserWidget } from './AuthHeaderUserWidget';
import { Session } from 'next-auth';

interface AuthHeaderProps {
  session?: Session;
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
