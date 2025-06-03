import { FC } from 'react';
import {
  TextCell,
  StyledDivIndicatorInformationPeriodCellContent,
} from './indicatorCell.styles';

interface IndicatorInfoPeriodCellProps {
  content: string;
}

export const IndicatorInfoPeriodCell: FC<IndicatorInfoPeriodCellProps> = ({
  content,
}: IndicatorInfoPeriodCellProps) => {
  return (
    <TextCell data-testid="heatmap-cell-indicator-info-period">
      <StyledDivIndicatorInformationPeriodCellContent>
        {content}
      </StyledDivIndicatorInformationPeriodCellContent>
    </TextCell>
  );
};
