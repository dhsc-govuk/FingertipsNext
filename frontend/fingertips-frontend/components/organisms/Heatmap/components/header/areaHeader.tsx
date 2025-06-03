import { HeaderCell, HeaderTitleWrapper, Title } from './areaHeader.styles';

interface AreaHeaderProps {
  content: string;
}

export const AreaHeader: React.FC<AreaHeaderProps> = ({
  content,
}: AreaHeaderProps) => {
  return (
    <HeaderCell>
      <HeaderTitleWrapper>
        <Title>{content}</Title>
      </HeaderTitleWrapper>
    </HeaderCell>
  );
};
