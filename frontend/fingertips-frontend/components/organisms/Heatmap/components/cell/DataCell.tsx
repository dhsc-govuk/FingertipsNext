import { getTextColour, GovukColours } from '@/lib/styleHelpers/colours';
import { FC, MouseEventHandler } from 'react';
import { DataTableCell, DataCellContent } from './DataCell.styles';

interface DataCellProps {
  content: string;
  backgroundColour?: string;
  mouseEnterHandler?: MouseEventHandler;
  mouseLeaveHandler?: MouseEventHandler;
}

export const DataCell: FC<DataCellProps> = ({
  content,
  backgroundColour = GovukColours.White,
  mouseEnterHandler,
  mouseLeaveHandler,
}: DataCellProps) => {
  return (
    <DataTableCell
      data-testid="heatmap-cell-data"
      $color={getTextColour(backgroundColour)}
      $backgroundColor={backgroundColour}
      onMouseOver={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <DataCellContent>{content}</DataCellContent>
    </DataTableCell>
  );
};
