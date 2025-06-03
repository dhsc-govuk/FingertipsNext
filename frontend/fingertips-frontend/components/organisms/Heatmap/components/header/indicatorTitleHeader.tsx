import {
  IndicatorTitleCellHeader,
  IndicatorTitleText,
} from './indicatorHeader.styles';

interface IndicatorTitleHeaderProps {
  content: string;
}

export const IndicatorTitleHeader: React.FC<IndicatorTitleHeaderProps> = ({
  content,
}: IndicatorTitleHeaderProps) => {
  return (
    <IndicatorTitleCellHeader>
      <IndicatorTitleText>{content}</IndicatorTitleText>
    </IndicatorTitleCellHeader>
  );
};
