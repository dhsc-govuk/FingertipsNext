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
    <ValueUnitHeaderCell data-testid="heatmap-header-value-unit">
      <IndicatorInfoText>{content}</IndicatorInfoText>
    </ValueUnitHeaderCell>
  );
};
