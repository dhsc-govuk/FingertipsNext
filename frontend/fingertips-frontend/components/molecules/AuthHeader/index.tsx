import { AuthButton } from '@/components/atoms/AuthButton';
import { Content, PositionWrapper } from './AuthHeader.styles';
import { Session } from 'next-auth';

interface AuthHeaderProps {
  session?: Session;
}

export function AuthHeader({ session }: AuthHeaderProps) {
  return (
    <PositionWrapper>
      <Content>
        <AuthButton session={session} />
      </Content>
    </PositionWrapper>
  );
}
