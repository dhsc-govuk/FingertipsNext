import { AuthButton } from '@/components/atoms/AuthButton';
import { Content, ContentItem, PositionWrapper } from './AuthHeader.styles';
import { AuthHeaderUserWidget } from './AuthHeaderUserWidget';
import { Auth } from '@/lib/auth/authHandlers';

interface AuthHeaderProps {
  auth?: Auth;
}

export function AuthHeader({ auth }: AuthHeaderProps) {
  return auth ? (
    <PositionWrapper>
      <Content>
        <AuthHeaderUserWidget session={auth.session} />
        <ContentItem>
          <AuthButton
            data-testid={'auth-button'}
            session={auth.session}
            signInHandler={auth.signInHandler}
            signOutHandler={auth.signOutHandler}
          />
        </ContentItem>
      </Content>
    </PositionWrapper>
  ) : null;
}
