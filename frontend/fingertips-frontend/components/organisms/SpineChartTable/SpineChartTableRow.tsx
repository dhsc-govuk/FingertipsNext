'use client';

import { Table } from 'govuk-react';
import React from 'react';
import {
  StyledAlignLeftTableCell,
  StyledAlignRightTableCell,
} from '@/lib/tableHelpers';

import {
  StyledAlignCentreTableCell,
  StyledGroupCell,
  StyledBenchmarkCell,
} from './SpineChartTableStyles';
import { SpineChartProps } from '../SpineChart';
import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';

export interface SpineChartMissingData {
  value?: number;
}

export interface SpineChartTableRowData {
  indicatorId: number;
  indicator: string;
  unit: string;
  period: number;
  count?: number;
  value?: number;
  groupValue?: number;
  benchmarkValue?: number;
  benchmarkStatistics: SpineChartProps;
}

export function SpineChartMissingValue({
  value,
}: Readonly<SpineChartMissingData>) {
  return value ?? 'X';
}

export function SpineChartTableRow({
  indicator,
  unit,
  period,
  count,
  value,
  groupValue,
  benchmarkValue,
  benchmarkStatistics,
}: Readonly<SpineChartTableRowData>) {
  return (
    <Table.Row>
      <StyledAlignLeftTableCell data-testid={`indicator-cell`}>
        {indicator}
      </StyledAlignLeftTableCell>
      <StyledAlignLeftTableCell data-testid={`unit-cell`}>
        {unit}
      </StyledAlignLeftTableCell>
      <StyledAlignCentreTableCell data-testid={`period-cell`}>
        {period}
      </StyledAlignCentreTableCell>
      <StyledAlignCentreTableCell data-testid={`count-cell`}>
        {formatWholeNumber(count)}
      </StyledAlignCentreTableCell>
      <StyledAlignRightTableCell data-testid={`value-cell`}>
        {formatNumber(value)}
      </StyledAlignRightTableCell>
      <StyledGroupCell data-testid={`group-value-cell`}>
        {formatNumber(groupValue)}
      </StyledGroupCell>
      <StyledBenchmarkCell data-testid={`benchmark-value-cell`}>
        {formatNumber(benchmarkValue)}
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-worst-cell`}>
        {formatNumber(benchmarkStatistics.worst)}
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-best-cell`}>
        {formatNumber(benchmarkStatistics.best)}
      </StyledBenchmarkCell>
    </Table.Row>
  );
}
