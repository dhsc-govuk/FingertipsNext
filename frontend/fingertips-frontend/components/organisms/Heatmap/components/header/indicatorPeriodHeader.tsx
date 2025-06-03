import { PeriodHeaderCell, IndicatorInfoText } from './indicatorHeader.styles';

interface IndicatorPeriodHeaderProps {
  content: string;
}

export const IndicatorPeriodHeader: React.FC<IndicatorPeriodHeaderProps> = ({
  content,
}: IndicatorPeriodHeaderProps) => {
  return (
    <PeriodHeaderCell>
      <IndicatorInfoText>{content}</IndicatorInfoText>
    </PeriodHeaderCell>
  );
};
