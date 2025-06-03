import {
  StyledCellHeaderIndicatorTitle,
  StyledH4IndicatorHeader,
} from './indicatorHeader.styles';

interface IndicatorTitleHeaderProps {
  content: string;
}

export const IndicatorTitleHeader: React.FC<IndicatorTitleHeaderProps> = ({
  content,
}: IndicatorTitleHeaderProps) => {
  return (
    <StyledCellHeaderIndicatorTitle>
      <StyledH4IndicatorHeader>{content}</StyledH4IndicatorHeader>
    </StyledCellHeaderIndicatorTitle>
  );
};
