'use client';

import { Table } from 'govuk-react';
import React from 'react';

import {
  StyledAlignCentreTableCell,
  StyledAlignRightBorderRightTableCell,
  StyledAlignRightCellPadLeft,
  StyledBenchmarkCell,
  StyledBenchmarkChart,
  StyledGroupCell,
  StyledIndicatorTitleStickyLeftCell,
  StyledPeriodStickyCell,
  StyledValueUnitStickyCell,
} from './SpineChartTableStyles';
import { SpineChart } from '../SpineChart';
import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { TrendTag } from '@/components/molecules/TrendTag';
import { orderStatistics } from '../SpineChart/SpineChartHelpers';
import { SpineChartIndicatorData } from './spineChartTableHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export interface SpineChartMissingData {
  value?: number;
}

export interface SpineChartTableProps {
  indicatorData: SpineChartIndicatorData;
}

export function SpineChartMissingValue({
  value,
}: Readonly<SpineChartMissingData>) {
  return value ?? 'X';
}

export function SpineChartTableRow({
  indicatorData,
}: Readonly<SpineChartTableProps>) {
  const {
    indicatorName,
    benchmarkComparisonMethod,
    latestDataPeriod,
    valueUnit,
    areasHealthData,
    groupData,
    quartileData,
  } = indicatorData;
  const { best, worst } = orderStatistics(quartileData);
  const groupIsEngland = groupData.areaCode === areaCodeForEngland;
  const twoAreasRequested = areasHealthData.length === 2;
  let twoAreasLatestPeriodMatching = true;

  if (twoAreasRequested) {
    twoAreasLatestPeriodMatching =
      areasHealthData[0].healthData.at(-1)?.year ===
      areasHealthData[1].healthData.at(-1)?.year;
  }

  const areaNames:string[]= []
  areasHealthData.map((areaHealthData) => {
    areaNames.push(areaHealthData.areaName)
  }

  )
  return (
    <Table.Row>
      <StyledIndicatorTitleStickyLeftCell data-testid={`indicator-cell`}>
        {indicatorName}
      </StyledIndicatorTitleStickyLeftCell>
      <StyledPeriodStickyCell data-testid={`period-cell`}>
        {latestDataPeriod}
      </StyledPeriodStickyCell>
      <StyledValueUnitStickyCell data-testid={`unit-cell`}>
        {valueUnit}
      </StyledValueUnitStickyCell>

      {twoAreasRequested ? (
        <>
          <StyledAlignRightCellPadLeft data-testid={'area-1-count-cell'}>
            {formatWholeNumber(areasHealthData[0].healthData.at(-1)?.count)}
          </StyledAlignRightCellPadLeft>
          <StyledAlignRightBorderRightTableCell
            data-testid={'area-1-value-cell'}
          >
            {formatNumber(areasHealthData[0].healthData.at(-1)?.value)}
          </StyledAlignRightBorderRightTableCell>
          <StyledAlignRightCellPadLeft data-testid={'area-2-count-cell'}>
            {formatWholeNumber(
              twoAreasLatestPeriodMatching
                ? areasHealthData[1].healthData.at(-1)?.count
                : undefined
            )}
          </StyledAlignRightCellPadLeft>
          <StyledAlignRightBorderRightTableCell
            data-testid={'area-2-value-cell'}
          >
            {formatNumber(
              twoAreasLatestPeriodMatching
                ? areasHealthData[1].healthData.at(-1)?.value
                : undefined
            )}
          </StyledAlignRightBorderRightTableCell>
        </>
      ) : (
        <>
          <StyledAlignCentreTableCell data-testid={`trend-cell`}>
            <TrendTag
              trendFromResponse={
                areasHealthData[0].healthData.at(-1)?.trend ??
                HealthDataPointTrendEnum.CannotBeCalculated
              }
            />
          </StyledAlignCentreTableCell>
          <StyledAlignRightCellPadLeft data-testid={`count-cell`}>
            {formatWholeNumber(areasHealthData[0].healthData.at(-1)?.count)}
          </StyledAlignRightCellPadLeft>
          <StyledAlignRightBorderRightTableCell data-testid={`value-cell`}>
            {formatNumber(areasHealthData[0].healthData.at(-1)?.value)}
          </StyledAlignRightBorderRightTableCell>
        </>
      )}

      {!groupIsEngland ? (
        <StyledGroupCell data-testid={`group-value-cell`}>
          {formatNumber(groupData.healthData.at(-1)?.value)}
        </StyledGroupCell>
      ) : null}
      <StyledBenchmarkCell data-testid={`benchmark-value-cell`}>
        {formatNumber(quartileData.englandValue)}
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-worst-cell`}>
        {formatNumber(worst)}
      </StyledBenchmarkCell>
      <StyledBenchmarkChart data-testid={`benchmark-range`}>
        <SpineChart
          name={indicatorName}
          units={valueUnit}
          period={latestDataPeriod}
          benchmarkValue={quartileData.englandValue ?? 0}
          quartileData={quartileData}
          areaOneValue={areasHealthData[0].healthData.at(-1)?.value}

          areaTwoValue={areasHealthData[1]?.healthData.at(-1)?.value}
          areaNames={areaNames}     
          areaOneOutcome={
            areasHealthData[0].healthData.at(-1)?.benchmarkComparison?.outcome
          }
          areaTwoOutcome={
            areasHealthData[1]?.healthData.at(-1)?.benchmarkComparison?.outcome
          }
          groupValue={
            !groupIsEngland ? groupData.healthData.at(-1)?.value : undefined
          }
          groupName={
            !groupIsEngland ? groupData.areaName?? '' : ''
          }
          benchmarkMethod={benchmarkComparisonMethod}
        />
      </StyledBenchmarkChart>
      <StyledBenchmarkCell data-testid={`benchmark-best-cell`}>
        {formatNumber(best)}
      </StyledBenchmarkCell>
    </Table.Row>
  );
}
