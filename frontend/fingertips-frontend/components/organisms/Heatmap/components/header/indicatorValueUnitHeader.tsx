import {
  ValueUnitHeaderCell,
  IndicatorInfoText,
} from './indicatorHeader.styles';

interface IndicatorValueUnitHeaderProps {
  content: string;
}

export const IndicatorValueUnitHeader: React.FC<
  IndicatorValueUnitHeaderProps
> = ({ content }: IndicatorValueUnitHeaderProps) => {
  return (
    <ValueUnitHeaderCell>
      <IndicatorInfoText>{content}</IndicatorInfoText>
    </ValueUnitHeaderCell>
  );
};
