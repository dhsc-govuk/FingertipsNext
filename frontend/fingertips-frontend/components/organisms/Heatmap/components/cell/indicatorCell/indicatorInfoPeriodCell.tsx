import { FC } from 'react';
import {
  TextCell,
  IndicatorInfoPeriodCellContent,
} from './indicatorCell.styles';

interface IndicatorInfoPeriodCellProps {
  content: string;
}

export const IndicatorInfoPeriodCell: FC<IndicatorInfoPeriodCellProps> = ({
  content,
}: IndicatorInfoPeriodCellProps) => {
  return (
    <TextCell data-testid="heatmap-cell-indicator-info-period">
      <IndicatorInfoPeriodCellContent>{content}</IndicatorInfoPeriodCellContent>
    </TextCell>
  );
};
