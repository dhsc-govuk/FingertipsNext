import { FC } from 'react';
import {
  StyledCellText,
  StyledDivIndicatorInformationPeriodCellContent,
} from './heatmapCell.styles';

interface IndicatorInfoPeriodCellProps {
  content: string;
}

export const IndicatorInfoPeriodCell: FC<IndicatorInfoPeriodCellProps> = ({
  content,
}: IndicatorInfoPeriodCellProps) => {
  return (
    <StyledCellText data-testid="heatmap-cell-indicator-info-period">
      <StyledDivIndicatorInformationPeriodCellContent>
        {content}
      </StyledDivIndicatorInformationPeriodCellContent>
    </StyledCellText>
  );
};
