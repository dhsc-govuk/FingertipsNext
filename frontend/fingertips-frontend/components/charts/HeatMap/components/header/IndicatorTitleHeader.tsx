import { TitleHeaderCell, IndicatorTitleText } from './IndicatorHeader.styles';

interface IndicatorTitleHeaderProps {
  content: string;
}

export const IndicatorTitleHeader: React.FC<IndicatorTitleHeaderProps> = ({
  content,
}: IndicatorTitleHeaderProps) => {
  return (
    <TitleHeaderCell data-testid="heatmap-header-indicator-title">
      <IndicatorTitleText>{content}</IndicatorTitleText>
    </TitleHeaderCell>
  );
};
