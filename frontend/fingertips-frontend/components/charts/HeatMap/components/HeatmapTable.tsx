import { HeatmapHeader } from '@/components/charts/HeatMap/components/header';
import { HeatmapCell } from '@/components/charts/HeatMap/components/cell';
import React, { FC, MouseEvent } from 'react';
import styled from 'styled-components';
import { Table } from 'govuk-react';
import { useRotatedHeaders } from '@/components/charts/HeatMap/hooks/useRotatedHeaders';
import { Cell, Header, Row } from '../heatmap.types';

const StyledTable = styled(Table)({
  borderCollapse: 'separate',
  width: 'auto',
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
  headers: Header[];
  rows: Row[];
  handleMouseOverCell: (cell?: Cell) => (event: MouseEvent) => void;
}

const HeatmapTable: FC<HeatmapTableProps> = ({
  headers,
  rows,
  handleMouseOverCell,
}) => {
  const { containerRef } = useRotatedHeaders(headers);

  return (
    <StyledDivTableContainer ref={containerRef}>
      <StyledTable>
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
