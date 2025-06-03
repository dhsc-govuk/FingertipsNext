import { PeriodHeaderCell, IndicatorInfoText } from './indicatorHeader.styles';

interface IndicatorPeriodHeaderProps {
  content: string;
}

export const IndicatorPeriodHeader: React.FC<IndicatorPeriodHeaderProps> = ({
  content,
}: IndicatorPeriodHeaderProps) => {
  return (
    <PeriodHeaderCell data-testid="heatmap-header-period">
      <IndicatorInfoText>{content}</IndicatorInfoText>
    </PeriodHeaderCell>
  );
};
