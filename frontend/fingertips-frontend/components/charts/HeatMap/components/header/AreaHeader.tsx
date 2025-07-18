import { HeaderCell, HeaderTitleWrapper, Title } from './AreaHeader.styles';

interface AreaHeaderProps {
  content: string;
}

export const AreaHeader: React.FC<AreaHeaderProps> = ({
  content,
}: AreaHeaderProps) => {
  return (
    <HeaderCell data-testid="heatmap-header-area">
      <HeaderTitleWrapper>
        <Title>{content}</Title>
      </HeaderTitleWrapper>
    </HeaderCell>
  );
};
