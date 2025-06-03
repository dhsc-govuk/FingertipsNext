import { GovukColours } from '@/lib/styleHelpers/colours';
import { CellType } from '../../heatmapUtil';
import { FC, MouseEventHandler } from 'react';
import { IndicatorTitleCell } from './indicatorTitleCell';
import { IndicatorInfoValueUnitCell } from './indicatorInfoValueUnitCell';
import { IndicatorInfoPeriodCell } from './indicatorInfoPeriodCell';
import { DataCell } from './dataCell';

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
  backgroundColour = GovukColours.White,
  mouseEnterHandler,
  mouseLeaveHandler,
}) => {
  switch (cellType) {
    case CellType.IndicatorTitle:
      return <IndicatorTitleCell content={content} />;
    case CellType.IndicatorInformationPeriod:
      return <IndicatorInfoPeriodCell content={content} />;
    case CellType.IndicatorInformationValueUnit:
      return <IndicatorInfoValueUnitCell content={content} />;
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
