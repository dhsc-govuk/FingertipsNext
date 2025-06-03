import { getTextColour } from '@/lib/styleHelpers/colours';
import { FC, MouseEventHandler } from 'react';
import { StyledCellData, StyledDivDataCellContent } from './heatmapCell.styles';

interface DataCellProps {
  content: string;
  backgroundColour: string;
  mouseEnterHandler?: MouseEventHandler;
  mouseLeaveHandler?: MouseEventHandler;
}

export const DataCell: FC<DataCellProps> = ({
  content,
  backgroundColour,
  mouseEnterHandler,
  mouseLeaveHandler,
}: DataCellProps) => {
  return (
    <StyledCellData
      data-testid="heatmap-cell-data"
      $color={getTextColour(backgroundColour)}
      $backgroundColor={backgroundColour}
      onMouseOver={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <StyledDivDataCellContent>{content}</StyledDivDataCellContent>
    </StyledCellData>
  );
};
