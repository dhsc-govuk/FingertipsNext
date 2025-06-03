import { FC } from 'react';
import {
  IndicatorValueUnitCellContent,
  TextCell,
} from './indicatorCell.styles';
interface IndicatorValueUnitCellProps {
  content: string;
}

export const IndicatorValueUnitCell: FC<IndicatorValueUnitCellProps> = ({
  content,
}: IndicatorValueUnitCellProps) => {
  return (
    <TextCell data-testid="heatmap-cell-indicator-info-value-unit">
      <IndicatorValueUnitCellContent>{content}</IndicatorValueUnitCellContent>
    </TextCell>
  );
};
