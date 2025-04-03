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
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { TrendTag } from '@/components/molecules/TrendTag';

export interface SpineChartMissingData {
  value?: number;
}

export interface SpineChartTableRowData {
  indicatorId: number;
  indicator: string;
  unit: string;
  period: number;
  trend: HealthDataPointTrendEnum;
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
  trend,
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
      <StyledAlignCentreTableCell>
        <TrendTag trendFromResponse={trend} />
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
      <StyledBenchmarkCell data-testid={`benchmark-range`}>
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-best-cell`}>
        {formatNumber(benchmarkStatistics.best)}
      </StyledBenchmarkCell>
    </Table.Row>
  );
}
