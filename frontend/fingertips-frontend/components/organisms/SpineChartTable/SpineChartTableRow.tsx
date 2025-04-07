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
  StyledAlignStickyCentreTableCell,
  StyledAlignCentreBorderRightTableCell,
  StyledStickyRightGroupCell,
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
  areaOneCount?: number;
  areaOneValue?: number;
  areaTwoCount?: number;
  areaTwoValue?: number;
  value?: number;
  groupValue?: number;
  benchmarkValue?: number;
  benchmarkStatistics: QuartileData;
  twoAreasRequested: boolean;
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
  areaTwoCount,
  areaTwoValue,
  groupValue,
  benchmarkValue,
  benchmarkStatistics,
  twoAreasRequested

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
      {!twoAreasRequested ?
        (
          <StyledAlignCentreTableCell data-testid={`period-cell`}>
            {period}
          </StyledAlignCentreTableCell>
        ) :
        (
          <StyledAlignStickyCentreTableCell data-testid={`period-cell`}>
            {period}
          </StyledAlignStickyCentreTableCell>
        )
      }

      {twoAreasRequested ?
        <>
          <StyledAlignCentreTableCell data-testid={`area-1-count-cell`}>
            {formatWholeNumber(areaOneCount)}
          </StyledAlignCentreTableCell>
          <StyledAlignCentreBorderRightTableCell data-testid={`area-1-value-cell`}>
            {formatNumber(areaOneValue)}
          </StyledAlignCentreBorderRightTableCell>
          <StyledAlignCentreTableCell data-testid={`area-2-count-cell`}>
            {formatWholeNumber(areaTwoCount)}
          </StyledAlignCentreTableCell>
          <StyledAlignRightTableCell data-testid={`area-2-value-cell`}>
            {formatNumber(areaTwoValue)}
          </StyledAlignRightTableCell>
        </>
      :
        <>
          <StyledAlignCentreTableCell data-testid={`trend-cell`}>
            <TrendTag trendFromResponse={trend} />
          </StyledAlignCentreTableCell>
          <StyledAlignRightTableCell data-testid={`count-cell`}>
            {formatWholeNumber(areaOneCount)}
          </StyledAlignRightTableCell>
          <StyledAlignCentreTableCell data-testid={`value-cell`}>
            {formatNumber(areaOneValue)}
          </StyledAlignCentreTableCell>
        </>
      }

      {!twoAreasRequested ?
        (<StyledGroupCell data-testid={`group-value-cell`}>
          {formatNumber(groupValue)}
        </StyledGroupCell>)
        :
        (<StyledStickyRightGroupCell data-testid={`group-value-cell`}>
          {formatNumber(groupValue)}
        </StyledStickyRightGroupCell>)
      }
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
