import { FC } from 'react';
import { TextCell, IndicatorPeriodCellContent } from './indicatorCell.styles';

interface IndicatorPeriodCellProps {
  content: string;
}

export const IndicatorPeriodCell: FC<IndicatorPeriodCellProps> = ({
  content,
}: IndicatorPeriodCellProps) => {
  return (
    <TextCell data-testid="heatmap-cell-indicator-info-period">
      <IndicatorPeriodCellContent>{content}</IndicatorPeriodCellContent>
    </TextCell>
  );
};
