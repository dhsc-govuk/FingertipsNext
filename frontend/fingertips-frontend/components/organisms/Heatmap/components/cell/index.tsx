import { CellType } from '../../heatmapTypes';
import { FC, MouseEventHandler } from 'react';
import { IndicatorTitleCell } from './IndicatorTitleCell';
import { IndicatorValueUnitCell } from './IndicatorValueUnitCell';
import { IndicatorPeriodCell } from './IndicatorPeriodCell';
import { DataCell } from './DataCell';

interface HeatmapCellProps {
  cellType: CellType;
  content: string;
  backgroundColour?: string;
  mouseEnterHandler?: MouseEventHandler;
  mouseLeaveHandler?: MouseEventHandler;
}

export const HeatmapCell: FC<HeatmapCellProps> = ({
  cellType,
  content,
  backgroundColour,
  mouseEnterHandler,
  mouseLeaveHandler,
}) => {
  switch (cellType) {
    case CellType.IndicatorTitle:
      return <IndicatorTitleCell content={content} />;
    case CellType.IndicatorPeriod:
      return <IndicatorPeriodCell content={content} />;
    case CellType.IndicatorValueUnit:
      return <IndicatorValueUnitCell content={content} />;
    case CellType.Data:
      return (
        <DataCell
          content={content}
          backgroundColour={backgroundColour}
          mouseEnterHandler={mouseEnterHandler}
          mouseLeaveHandler={mouseLeaveHandler}
        />
      );
  }
};
