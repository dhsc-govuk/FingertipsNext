'use client';

import {
  extractSortedAreasIndicatorsAndDataPoints,
  generateHeaders,
  generateRows,
  HeatmapIndicatorData,
} from './heatmapUtil';
import { Table } from 'govuk-react';
import styled from 'styled-components';
import { HeatmapHeader } from './heatmapHeader';
import { HeatmapCell } from './heatmapCell';
import { BenchmarkLegend } from '../BenchmarkLegend';

export interface HeatmapProps {
  indicatorData: HeatmapIndicatorData[];
  groupAreaCode?: string;
}

const StyledTable = styled(Table)({
  display: 'block',
  width: '100%',
  tableLayout: 'fixed',
});

const StyledDivTableContainer = styled.div({
  overflowX: 'scroll',
  maxWidth: '960px',
});

export function Heatmap({
  indicatorData,
  groupAreaCode,
}: Readonly<HeatmapProps>) {
  const { areas, indicators, dataPoints } =
    extractSortedAreasIndicatorsAndDataPoints(indicatorData, groupAreaCode);

  const headers = generateHeaders(areas, groupAreaCode);
  const rows = generateRows(areas, indicators, dataPoints);

  return (
    <>
      <BenchmarkLegend />
      <StyledDivTableContainer>
        <StyledTable data-testid="heatmapChart-component">
          <Table.Row>
            {headers.map((header) => {
              return (
                <HeatmapHeader
                  key={header.key}
                  headerType={header.type}
                  content={header.content}
                />
              );
            })}
          </Table.Row>
          {rows.map((row) => {
            return (
              <Table.Row key={row.key}>
                {row.cells.map((cell) => {
                  return (
                    <HeatmapCell
                      key={cell.key}
                      cellType={cell.type}
                      content={cell.content}
                      backgroundColour={cell.backgroundColour}
                    />
                  );
                })}
              </Table.Row>
            );
          })}
        </StyledTable>
      </StyledDivTableContainer>
    </>
  );
}
