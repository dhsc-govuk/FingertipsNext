'use client';

import {
  extractSortedAreasIndicatorsAndDataPoints,
  generateHeaders,
  generateRows,
} from './heatmapUtil';
import { Table } from 'govuk-react';
import styled from 'styled-components';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { HeatmapHeader } from './heatmapHeader';
import { HeatmapCell } from './heatmapCell';

export interface HeatmapIndicatorData {
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
}

export interface HeatmapProps {
  indicatorData: HeatmapIndicatorData[];
  groupAreaCode?: string;
}

const StyledTable = styled(Table)({
  overflowX: 'scroll',
  display: 'block',
  paddingBottom: '12px',
});

const BlockDiv = styled.div({
  width: '630px', // TODO - not sure this should be hardcoded, is it'll break on smaller screens.
  display: 'block',
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
    <BlockDiv>
      <StyledTable data-testid="heatmap-component">
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
    </BlockDiv>
  );
}
