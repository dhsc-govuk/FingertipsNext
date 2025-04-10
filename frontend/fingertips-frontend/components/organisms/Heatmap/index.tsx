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
import { HeatmapHover } from './heatmapHover';
import React from 'react';

export interface HeatmapProps {
  indicatorData: HeatmapIndicatorData[];
  groupAreaCode?: string;
}

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

  const idPrefix = 'hover'; //useId(); // - useId breaks Next hydration for some reason
  const getHoverId = (cellKey: string) => {
    return `${idPrefix}-${cellKey}`;
  };

  const handleMouseOverCell = (event: React.MouseEvent, hoverId: string) => {
    const hoverElement = document.getElementById(hoverId);
    if (!hoverElement) {
      return;
    }
    const cellRect = event.currentTarget.getBoundingClientRect();

    hoverElement.style.display = 'block';
    hoverElement.style.left = `${cellRect?.right + 12}px`;
    console.log(cellRect?.top + (cellRect?.bottom - cellRect?.top) / 2);
    hoverElement.style.top = `${cellRect?.top + (cellRect?.bottom - cellRect?.top) / 2}px`;
  };

  const handleMouseLeaveCell = (hoverId: string) => {
    const hoverElement = document.getElementById(hoverId);
    if (!hoverElement) {
      return;
    }

    hoverElement.style.display = 'none';
  };

  return (
    <>
      <BenchmarkLegend />
      {rows.flatMap((row) => {
        return row.cells.map((cell) => {
          return cell.hoverProps ? (
            <HeatmapHover
              key={`hover-${cell.key}`}
              areaName={cell.hoverProps.areaName}
              period={cell.hoverProps.period}
              indicatorName={cell.hoverProps.indicatorName}
              value={cell.hoverProps.value}
              unitLabel={cell.hoverProps.unitLabel}
              benchmark={cell.hoverProps.benchmark}
              hoverId={getHoverId(cell.key)}
            />
          ) : null;
        });
      })}
      <StyledDivTableContainer>
        <StyledTable data-testid="heatmapChart-component">
          <StyledRow>
            {headers.map((header) => {
              return (
                <HeatmapHeader
                  key={header.key}
                  headerType={header.type}
                  content={header.content}
                />
              );
            })}
          </StyledRow>
          {rows.map((row) => {
            return (
              <StyledRow key={row.key}>
                {row.cells.map((cell) => {
                  return (
                    <HeatmapCell
                      key={cell.key}
                      cellType={cell.type}
                      content={cell.content}
                      backgroundColour={cell.backgroundColour}
                      mouseEnterHandler={(e) => {
                        handleMouseOverCell(e, getHoverId(cell.key));
                      }}
                      mouseLeaveHandler={() => {
                        handleMouseLeaveCell(getHoverId(cell.key));
                      }}
                    />
                  );
                })}
              </StyledRow>
            );
          })}
        </StyledTable>
      </StyledDivTableContainer>
    </>
  );
}
