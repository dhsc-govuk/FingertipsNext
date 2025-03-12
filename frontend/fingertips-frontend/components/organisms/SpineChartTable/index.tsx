'use client';

import { Table } from 'govuk-react';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  convertToPercentage,
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledDiv,
  StyledGreyHeader,
  StyledGreyTableCellValue,
} from '@/lib/tableHelpers';
import { Sex } from '../Inequalities/inequalitiesHelpers';

export enum SpineChartTableHeadingEnum {
  IndicatorName = 'Indicator',
  IndicatorUnit = 'Unit',
  IndicatorPeriod = 'Period',
  AreaCount = 'Count',
  AreaValue = 'Value',
  GroupValue = 'Value',
  BenchmarkValue = 'Value',
  BenchmarkWorst = 'Worst',
  BenchmarkBest = 'Best',
}

export interface TableProps {
  healthIndicatorData: HealthDataForArea[];
  englandBenchmarkData: HealthDataForArea;
  groupIndicatorData: HealthDataForArea;
}

export interface TableHeaderProps {
  areaName: string;
  groupName: string;
}

export interface SpineChartTableRowData {
  period: number;
  count?: number;
  value?: number;
}

const StyledAreaNameHeader = styled(StyledAlignLeftHeader)({
  width: '10%',
  padding: '1em 0',
  textAlign: 'center',
});

const StyledGroupHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
});

const StyledBenchmarkHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.DarkGrey,
});

export function SpineChartTableHeader({
  areaName,
  groupName,
}: Readonly<TableHeaderProps>) {
  return (
    <>
      <Table.Row>
        <Table.CellHeader colspan={3}  data-testid="empty-header">
        </Table.CellHeader>
        <Table.CellHeader colspan={2} data-testid="area-header">
          {areaName}
        </Table.CellHeader>
        <StyledGroupHeader data-testid="group-header">
          {groupName}
        </StyledGroupHeader>
        <StyledBenchmarkHeader colspan={3} data-testid="england-header">
          Benchmark: England
        </StyledBenchmarkHeader>
      </Table.Row> 
      <Table.Row>
        {Object.values(SpineChartTableHeadingEnum).map((heading) => (
          <Table.CellHeader data-testid="$heading-header">
          </Table.CellHeader>
        ))}
      </Table.Row>          
    </>
  )
}
