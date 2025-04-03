'use client';

import {
  extractSortedAreasIndicatorsAndDataPoints,
  generateHeaders,
  generateRows,
} from './heatmapUtil';
import { SectionBreak, Table } from 'govuk-react';
import styled from 'styled-components';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { HeatmapHeader } from './heatmapHeader';
import { HeatmapCell } from './heatmapCell';
import { BenchmarkLegend } from '../BenchmarkLegend';

export interface HeatmapIndicatorData {
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
  benchmarkMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export interface HeatmapProps {
  indicatorData: HeatmapIndicatorData[];
  groupAreaCode?: string;
}

const StyledTable = styled(Table)({
  display: 'block',
  width: '100%',
  tableLayout: 'fixed',
  overflow: 'visible',
});

const StyledDivTableContainer = styled.div({
  overflowY: 'visible',
  overflowX: 'scroll',
  maxWidth: '960px',
});

const StyledDivHeatmapContainer = styled.div({
  paddingBottom: '100px',
  overflow: 'visible',
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
    <StyledDivHeatmapContainer>
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
                      hoverProps={cell.hoverProps}
                    />
                  );
                })}
              </Table.Row>
            );
          })}
        </StyledTable>
        <SectionBreak />
      </StyledDivTableContainer>
    </StyledDivHeatmapContainer>
  );
}
