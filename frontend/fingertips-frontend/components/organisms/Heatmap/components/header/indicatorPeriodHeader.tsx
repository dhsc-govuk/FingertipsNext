import {
  StyledCellHeaderIndicatorInformationPeriod,
  StyledH4Header,
} from './indicatorHeader.styles';

interface IndicatorPeriodHeaderProps {
  content: string;
}

export const IndicatorPeriodHeader: React.FC<IndicatorPeriodHeaderProps> = ({
  content,
}: IndicatorPeriodHeaderProps) => {
  return (
    <StyledCellHeaderIndicatorInformationPeriod>
      <StyledH4Header>{content}</StyledH4Header>
    </StyledCellHeaderIndicatorInformationPeriod>
  );
};
