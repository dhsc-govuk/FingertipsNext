import { FC } from 'react';
import {
  IndicatorInfoValueCellContent,
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
      <IndicatorInfoValueCellContent>{content}</IndicatorInfoValueCellContent>
    </TextCell>
  );
};
