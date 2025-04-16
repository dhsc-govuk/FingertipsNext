import { HeatmapHeader } from '@/components/organisms/Heatmap/heatmapHeader';
import { HeatmapCell } from '@/components/organisms/Heatmap/heatmapCell';
import React, { FC, MouseEvent } from 'react';
import styled from 'styled-components';
import { Table } from 'govuk-react';
import {
  generateHeaders,
  generateRows,
  HeatmapDataCell,
} from '@/components/organisms/Heatmap/heatmapUtil';

const StyledTable = styled(Table)({
  display: 'block',
  width: '100%',
  tableLayout: 'fixed',
  overflow: 'visible',
  height: 'fit-content',
});

const StyledRow = styled(Table.Row)({
  height: '100%',
});

const StyledDivTableContainer = styled.div({
  overflowY: 'visible',
  overflowX: 'scroll',
});

interface HeatmapTableProps {
  headers: ReturnType<typeof generateHeaders>;
  rows: ReturnType<typeof generateRows>;
  handleMouseOverCell: (cell?: HeatmapDataCell) => (event: MouseEvent) => void;
}

const HeatmapTable: FC<HeatmapTableProps> = ({
  headers,
  rows,
  handleMouseOverCell,
}) => {
  return (
    <StyledDivTableContainer>
      <StyledTable data-testid="heatmapChart-component">
        <StyledRow>
          {headers.map((header) => (
            <HeatmapHeader
              key={header.key}
              headerType={header.type}
              content={header.content}
            />
          ))}
        </StyledRow>
        {rows.map((row) => {
          return (
            <StyledRow key={row.key}>
              {row.cells.map((cell) => (
                <HeatmapCell
                  key={cell.key}
                  cellType={cell.type}
                  content={cell.content}
                  backgroundColour={cell.backgroundColour}
                  mouseEnterHandler={handleMouseOverCell(cell)}
                  mouseLeaveHandler={handleMouseOverCell()}
                />
              ))}
            </StyledRow>
          );
        })}
      </StyledTable>
    </StyledDivTableContainer>
  );
};
export default React.memo(HeatmapTable);
