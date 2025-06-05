import { FC } from 'react';
import {
  IndicatorTitleCellContent,
  IndicatorCell,
} from './IndicatorCell.styles';

interface IndicatorTitleCellProps {
  content: string;
}

export const IndicatorTitleCell: FC<IndicatorTitleCellProps> = ({
  content,
}: IndicatorTitleCellProps) => {
  return (
    <IndicatorCell data-testid="heatmap-cell-indicator-title">
      <IndicatorTitleCellContent>{content}</IndicatorTitleCellContent>
    </IndicatorCell>
  );
};
