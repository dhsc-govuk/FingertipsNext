'use client';

import { Table } from 'govuk-react';
import React from 'react';
import {
  StyledAlignLeftTableCell,
  StyledAlignRightTableCell,
  StyledIndicatorTitleCell,
} from '@/lib/tableHelpers';

import {
  StyledAlignCentreBorderRightTableCell,
  StyledAlignCentreTableCell,
  StyledAlignRightBorderRightTableCell,
  StyledBenchmarkCell,
  StyledBenchmarkChart,
  StyledGroupCell,
} from './SpineChartTableStyles';
import { SpineChart } from '../SpineChart';
import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
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
  areaOneCount?: number;
  areaOneValue?: number;
  areaOneOutcome?: BenchmarkOutcome;
  areaTwoCount?: number;
  areaTwoValue?: number;
  areaTwoOutcome?: BenchmarkOutcome;
  groupValue?: number;
  benchmarkValue?: number;
  benchmarkStatistics: QuartileData;
  twoAreasRequested: boolean;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
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
  areaOneCount,
  areaOneValue,
  areaOneOutcome,
  areaTwoCount,
  areaTwoValue,
  areaTwoOutcome,
  groupValue,
  benchmarkValue,
  benchmarkStatistics,
  twoAreasRequested,
  benchmarkComparisonMethod,
}: Readonly<SpineChartTableRowData>) {
  const { best, worst } = orderStatistics(benchmarkStatistics);

  return (
    <Table.Row>
      <StyledIndicatorTitleCell data-testid={`indicator-cell`}>
        {indicator}
      </StyledIndicatorTitleCell>
      <StyledAlignLeftTableCell data-testid={`unit-cell`}>
        {unit}
      </StyledAlignLeftTableCell>

      {twoAreasRequested ? (
        <StyledAlignCentreBorderRightTableCell data-testid={`period-cell`}>
          {period}
        </StyledAlignCentreBorderRightTableCell>
      ) : (
        <StyledAlignCentreTableCell data-testid={`period-cell`}>
          {period}
        </StyledAlignCentreTableCell>
      )}

      {twoAreasRequested ? (
        <>
          <StyledAlignCentreTableCell data-testid={`area-1-count-cell`}>
            {formatWholeNumber(areaOneCount)}
          </StyledAlignCentreTableCell>
          <StyledAlignRightBorderRightTableCell
            data-testid={`area-1-value-cell`}
          >
            {formatNumber(areaOneValue)}
          </StyledAlignRightBorderRightTableCell>
          <StyledAlignCentreTableCell data-testid={`area-2-count-cell`}>
            {formatWholeNumber(areaTwoCount)}
          </StyledAlignCentreTableCell>
          <StyledAlignRightTableCell data-testid={`area-2-value-cell`}>
            {formatNumber(areaTwoValue)}
          </StyledAlignRightTableCell>
        </>
      ) : (
        <>
          <StyledAlignCentreTableCell data-testid={`trend-cell`}>
            <TrendTag trendFromResponse={trend} />
          </StyledAlignCentreTableCell>
          <StyledAlignCentreTableCell data-testid={`count-cell`}>
            {formatWholeNumber(areaOneCount)}
          </StyledAlignCentreTableCell>
          <StyledAlignRightTableCell data-testid={`value-cell`}>
            {formatNumber(areaOneValue)}
          </StyledAlignRightTableCell>
        </>
      )}

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
          areaOneValue={areaOneValue}
          areaTwoValue={areaTwoValue}
          areaOneOutcome={areaOneOutcome}
          areaTwoOutcome={areaTwoOutcome}
          groupValue={groupValue}
          benchmarkMethod={benchmarkComparisonMethod}
        />
      </StyledBenchmarkChart>
      <StyledBenchmarkCell data-testid={`benchmark-best-cell`}>
        {formatNumber(best)}
      </StyledBenchmarkCell>
    </Table.Row>
  );
}
