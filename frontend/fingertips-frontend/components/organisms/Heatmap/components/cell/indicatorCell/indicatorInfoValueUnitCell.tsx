import { FC } from 'react';
import {
  StyledDivIndicatorInformationValueUnitCellContent,
  TextCell,
} from './indicatorCell.styles';
interface IndicatorInfoValueUnitCellProps {
  content: string;
}

export const IndicatorInfoValueUnitCell: FC<
  IndicatorInfoValueUnitCellProps
> = ({ content }: IndicatorInfoValueUnitCellProps) => {
  return (
    <TextCell data-testid="heatmap-cell-indicator-info-value-unit">
      <StyledDivIndicatorInformationValueUnitCellContent>
        {content}
      </StyledDivIndicatorInformationValueUnitCellContent>
    </TextCell>
  );
};
