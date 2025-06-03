import { FC } from 'react';
import {
  StyledCellText,
  StyledDivIndicatorInformationValueUnitCellContent,
} from './heatmapCell.styles';

interface IndicatorInfoValueUnitCellProps {
  content: string;
}

export const IndicatorInfoValueUnitCell: FC<
  IndicatorInfoValueUnitCellProps
> = ({ content }: IndicatorInfoValueUnitCellProps) => {
  return (
    <StyledCellText data-testid="heatmap-cell-indicator-info-value-unit">
      <StyledDivIndicatorInformationValueUnitCellContent>
        {content}
      </StyledDivIndicatorInformationValueUnitCellContent>
    </StyledCellText>
  );
};
