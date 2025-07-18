import { AuthButton } from '@/components/atoms/AuthButton';
import {
  Content,
  PositionWrapper,
  PositionWrapperInner,
} from './AuthHeader.styles';
import { Session } from 'next-auth';

interface AuthHeaderProps {
  session?: Session;
}

export function AuthHeader({ session }: Readonly<AuthHeaderProps>) {
  return (
    <PositionWrapper>
      <PositionWrapperInner>
        <Content>
          <AuthButton session={session} />
        </Content>
      </PositionWrapperInner>
    </PositionWrapper>
  );
}
