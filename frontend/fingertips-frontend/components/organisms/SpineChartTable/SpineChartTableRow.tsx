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
import { SpineChartIndicatorData } from './spineChartTableHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export interface SpineChartMissingData {
  value?: number;
}

export interface SpineChartTableProps {
  indicatorData: SpineChartIndicatorData
}

export function SpineChartMissingValue({
  value,
}: Readonly<SpineChartMissingData>) {
  return value ?? 'X';
}

export function SpineChartTableRow({
  indicatorData
}: Readonly<SpineChartTableProps>) {
  const {
    indicatorName,
    benchmarkComparisonMethod,
    latestDataPeriod,
    valueUnit,
    areasHealthData,
    groupData,
    quartileData
  } = indicatorData;
  const { best, worst } = orderStatistics(quartileData);
  const groupIsEngland = groupData.areaCode === areaCodeForEngland;
  const twoAreasRequested = areasHealthData.length === 2;
  let twoAreasLatestPeriodMatching;

  if (twoAreasRequested) {
    twoAreasLatestPeriodMatching = areasHealthData[0].healthData.at(-1)?.year === areasHealthData[1].healthData.at(-1)?.year;
  }

  return (
    <Table.Row>
      <StyledIndicatorTitleCell data-testid={`indicator-cell`}>
        {indicatorName}
      </StyledIndicatorTitleCell>
      <StyledAlignLeftTableCell data-testid={`unit-cell`}>
        {valueUnit}
      </StyledAlignLeftTableCell>

      {twoAreasRequested ? (
        <StyledAlignCentreBorderRightTableCell data-testid={`period-cell`}>
          {latestDataPeriod}
        </StyledAlignCentreBorderRightTableCell>
      ) : (
        <StyledAlignCentreTableCell data-testid={`period-cell`}>
          {latestDataPeriod}
        </StyledAlignCentreTableCell>
      )}

      {twoAreasRequested ? (
        <>
          <StyledAlignCentreTableCell data-testid={'area-1-count-cell'}>
            {formatWholeNumber(areasHealthData[0].healthData.at(-1)?.count)}
          </StyledAlignCentreTableCell>
          <StyledAlignRightBorderRightTableCell
            data-testid={'area-1-value-cell'}
          >
            {formatNumber(areasHealthData[0].healthData.at(-1)?.value)}
          </StyledAlignRightBorderRightTableCell>
          <StyledAlignCentreTableCell data-testid={'area-2-count-cell'}>
            {formatWholeNumber(twoAreasLatestPeriodMatching ? areasHealthData[1].healthData.at(-1)?.count : undefined)}
          </StyledAlignCentreTableCell>
          <StyledAlignRightTableCell data-testid={'area-2-value-cell'}>
            {formatNumber(twoAreasLatestPeriodMatching ? areasHealthData[1].healthData.at(-1)?.value : undefined)}
          </StyledAlignRightTableCell>
        </>
      ) : (
        <>
          <StyledAlignCentreTableCell data-testid={`trend-cell`}>
            <TrendTag trendFromResponse={areasHealthData[0].healthData.at(-1)?.trend ?? HealthDataPointTrendEnum.CannotBeCalculated} />
          </StyledAlignCentreTableCell>
          <StyledAlignCentreTableCell data-testid={`count-cell`}>
            {formatWholeNumber(areasHealthData[0].healthData.at(-1)?.count)}
          </StyledAlignCentreTableCell>
          <StyledAlignRightTableCell data-testid={`value-cell`}>
            {formatNumber(areasHealthData[0].healthData.at(-1)?.value)}
          </StyledAlignRightTableCell>
        </>
      )}

      {!groupIsEngland ?
        <StyledGroupCell data-testid={`group-value-cell`}>
          {formatNumber(groupData.healthData.at(-1)?.value)}
        </StyledGroupCell>
        :
        null
      }
      <StyledBenchmarkCell data-testid={`benchmark-value-cell`}>
        {formatNumber(quartileData.englandValue)}
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-worst-cell`}>
        {formatNumber(worst)}
      </StyledBenchmarkCell>
      <StyledBenchmarkChart data-testid={`benchmark-range`}>
        <SpineChart
          benchmarkValue={quartileData.englandValue ?? 0}
          quartileData={quartileData}
          areaOneValue={areasHealthData[0].healthData.at(-1)?.value}
          areaTwoValue={areasHealthData[1].healthData.at(-1)?.value}
          areaOneOutcome={areasHealthData[0].healthData.at(-1)?.benchmarkComparison?.outcome}
          areaTwoOutcome={areasHealthData[1].healthData.at(-1)?.benchmarkComparison?.outcome}
          groupValue={groupData.healthData.at(-1)?.value}
          benchmarkMethod={benchmarkComparisonMethod}
        />
      </StyledBenchmarkChart>
      <StyledBenchmarkCell data-testid={`benchmark-best-cell`}>
        {formatNumber(best)}
      </StyledBenchmarkCell>
    </Table.Row>
  );
}
