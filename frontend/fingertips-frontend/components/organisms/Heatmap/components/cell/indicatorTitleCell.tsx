import { FC } from 'react';
import {
  StyledDivIndicatorTitleCellContent,
  StyledIndicatorCell,
} from './heatmapCell.styles';

interface IndicatorTitleCellProps {
  content: string;
}

export const IndicatorTitleCell: FC<IndicatorTitleCellProps> = ({
  content,
}: IndicatorTitleCellProps) => {
  return (
    <StyledIndicatorCell data-testid="heatmap-cell-indicator-title">
      <StyledDivIndicatorTitleCellContent>
        {content}
      </StyledDivIndicatorTitleCellContent>
    </StyledIndicatorCell>
  );
};
