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
import { HeatmapHover, HeatmapHoverProps } from './heatmapHover';
import React, { MouseEventHandler, useMemo, useState } from 'react';

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
  const { headers, rows } = useMemo(() => {
    const { areas, indicators, dataPoints } =
      extractSortedAreasIndicatorsAndDataPoints(indicatorData, groupAreaCode);

    const headers = generateHeaders(areas, groupAreaCode);
    const rows = generateRows(areas, indicators, dataPoints);

    return { headers, rows };
  }, [indicatorData, groupAreaCode]);

  const [hoverState, setHoverState] = useState<HeatmapHoverProps | undefined>(
    undefined
  );

  const buildMouseEnterHandler = (
    hoverProps: HeatmapHoverProps | undefined
  ): React.MouseEventHandler => {
    if (!hoverProps) {
      return () => {
        setHoverState(undefined);
      };
    }

    return (e) => {
      const cellRect = e.currentTarget.getBoundingClientRect();
      const hoverPropsWithPosition: HeatmapHoverProps = {
        ...hoverProps,
        cellRight: cellRect?.right + 12,
        cellVerticalMidpoint:
          cellRect?.top + (cellRect?.bottom - cellRect?.top) / 2,
      };

      setHoverState(hoverPropsWithPosition);
    };
  };

  const onMouseLeave: MouseEventHandler = () => {
    setHoverState(undefined);
  };

  return (
    <>
      <BenchmarkLegend />
      <HeatmapHover hoverProps={hoverState} />
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
          {rows.map((row, rowIndex) => {
            return (
              <StyledRow key={row.key}>
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <HeatmapCell
                      key={cell.key}
                      cellType={cell.type}
                      content={cell.content}
                      backgroundColour={cell.backgroundColour}
                      mouseEnterHandler={buildMouseEnterHandler(
                        cell.hoverProps
                      )}
                      mouseLeaveHandler={onMouseLeave}
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
