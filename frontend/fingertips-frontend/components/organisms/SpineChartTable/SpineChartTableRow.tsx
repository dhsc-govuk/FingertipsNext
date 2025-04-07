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
  StyledBenchmarkChart,
} from './SpineChartTableStyles';
import { SpineChart } from '../SpineChart';
import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';
import {
  HealthDataPointTrendEnum,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { TrendTag } from '@/components/molecules/TrendTag';
import { orderStatistics } from '../SpineChart/SpineChartHelpers';

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
  benchmarkStatistics: QuartileData;
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
  const { best, worst } = orderStatistics(benchmarkStatistics);

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
        {formatNumber(worst)}
      </StyledBenchmarkCell>
      <StyledBenchmarkChart data-testid={`benchmark-range`}>
        <SpineChart
          benchmarkValue={benchmarkValue ?? 0}
          quartileData={benchmarkStatistics}
        />
      </StyledBenchmarkChart>
      <StyledBenchmarkCell data-testid={`benchmark-best-cell`}>
        {formatNumber(best)}
      </StyledBenchmarkCell>
    </Table.Row>
  );
}
