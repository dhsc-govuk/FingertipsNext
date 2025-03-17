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

export function SpineChartMissingValue({
  value,
}: Readonly<SpineChartMissingData>) {
  return <>{value ?? 'X'}</>;
}

export function SpineChartTableRow({
  indicator,
  unit,
  period,
  count,
  value,
  groupValue,
  benchmarkValue,
  benchmarkWorst,
  benchmarkBest,
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
        <SpineChartMissingValue value={count} />
      </StyledAlignCentreTableCell>
      <StyledAlignRightTableCell data-testid={`value-cell`}>
        <SpineChartMissingValue value={value} />
      </StyledAlignRightTableCell>
      <StyledGroupCell data-testid={`group-value-cell`}>
        <SpineChartMissingValue value={groupValue} />
      </StyledGroupCell>
      <StyledBenchmarkCell data-testid={`benchmark-value-cell`}>
        <SpineChartMissingValue value={benchmarkValue} />
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-worst-cell`}>
        {benchmarkWorst}
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-best-cell`}>
        {benchmarkBest}
      </StyledBenchmarkCell>
    </Table.Row>
  );
}
