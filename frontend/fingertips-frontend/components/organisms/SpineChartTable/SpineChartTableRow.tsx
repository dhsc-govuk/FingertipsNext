'use client';

import { Table } from 'govuk-react';
import React, { FC } from 'react';

import {
  StyledAlignCentreTableCell,
  StyledAlignLeftTableCellPaddingLeft,
  StyledAlignRightBorderRightTableCell,
  StyledAlignRightCellPadLeft,
  StyledBenchmarkCell,
  StyledBenchmarkChart,
  StyledGroupCell,
  StyledIndicatorTitleStickyLeftCell,
} from './SpineChartTable.Styles';
import { SpineChart } from '../SpineChart';
import { formatNumber, formatWholeNumber } from '@/lib/numberFormatter';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { TrendTag } from '@/components/molecules/TrendTag';
import { orderStatistics } from '../SpineChart/SpineChartHelpers';
import { SpineChartIndicatorData } from './spineChartTableHelpers';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';
import { StyledAlignRightTableCellPaddingRight } from '@/lib/tableHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

export interface SpineChartTableRowProps {
  indicatorData: SpineChartIndicatorData;
  benchmarkToUse: string;
  searchState: SearchStateParams;
  twoAreasRequested?: boolean;
}

export const SpineChartTableRow: FC<SpineChartTableRowProps> = ({
  indicatorData,
  twoAreasRequested = false,
  benchmarkToUse,
  searchState,
}) => {
  const { [SearchParams.GroupSelected]: selectedGroupCode } = searchState;

  const {
    indicatorName,
    benchmarkComparisonMethod,
    latestDataPeriod,
    valueUnit,
    areasHealthData,
    groupData,
    englandData,
    quartileData,
  } = indicatorData;
  const { best, worst } = orderStatistics(quartileData);

  let twoAreasLatestPeriodMatching = true;

  if (twoAreasRequested) {
    twoAreasLatestPeriodMatching =
      areasHealthData[0]?.healthData.at(-1)?.year ===
      areasHealthData[1]?.healthData.at(-1)?.year;
  }

  const areaNames = areasHealthData.map(
    (areaHealthData) => areaHealthData?.areaName ?? ''
  );

  const benchmarkData =
    benchmarkToUse === areaCodeForEngland ? englandData : groupData;

  const alternativeBenchmarkData =
    benchmarkToUse === areaCodeForEngland ? groupData : englandData;

  const benchmarkQuartileValue =
    benchmarkToUse === areaCodeForEngland
      ? quartileData.englandValue
      : quartileData.ancestorValue;

  const shouldShowAlternativeBenchmark =
    selectedGroupCode !== areaCodeForEngland;

  return (
    <Table.Row>
      <StyledIndicatorTitleStickyLeftCell data-testid={`indicator-cell`}>
        {indicatorName}
      </StyledIndicatorTitleStickyLeftCell>
      <StyledAlignRightTableCellPaddingRight data-testid={`period-cell`}>
        {latestDataPeriod}
      </StyledAlignRightTableCellPaddingRight>
      <StyledAlignLeftTableCellPaddingLeft data-testid={`unit-cell`}>
        {valueUnit}
      </StyledAlignLeftTableCellPaddingLeft>

      {twoAreasRequested ? (
        <>
          <StyledAlignRightCellPadLeft data-testid={'area-1-count-cell'}>
            {formatWholeNumber(areasHealthData[0]?.healthData.at(-1)?.count)}
          </StyledAlignRightCellPadLeft>
          <StyledAlignRightBorderRightTableCell
            data-testid={'area-1-value-cell'}
          >
            {formatNumber(areasHealthData[0]?.healthData.at(-1)?.value)}
          </StyledAlignRightBorderRightTableCell>
          <StyledAlignRightCellPadLeft data-testid={'area-2-count-cell'}>
            {formatWholeNumber(
              twoAreasLatestPeriodMatching
                ? areasHealthData[1]?.healthData.at(-1)?.count
                : undefined
            )}
          </StyledAlignRightCellPadLeft>
          <StyledAlignRightBorderRightTableCell
            data-testid={'area-2-value-cell'}
          >
            {formatNumber(
              twoAreasLatestPeriodMatching
                ? areasHealthData[1]?.healthData.at(-1)?.value
                : undefined
            )}
          </StyledAlignRightBorderRightTableCell>
        </>
      ) : (
        <>
          <StyledAlignCentreTableCell data-testid={`trend-cell`}>
            <TrendTag
              trendFromResponse={
                areasHealthData[0]?.healthData.at(-1)?.trend ??
                HealthDataPointTrendEnum.CannotBeCalculated
              }
            />
          </StyledAlignCentreTableCell>
          <StyledAlignRightCellPadLeft data-testid={`count-cell`}>
            {formatWholeNumber(areasHealthData[0]?.healthData.at(-1)?.count)}
          </StyledAlignRightCellPadLeft>
          <StyledAlignRightBorderRightTableCell data-testid={`value-cell`}>
            {formatNumber(areasHealthData[0]?.healthData.at(-1)?.value)}
          </StyledAlignRightBorderRightTableCell>
        </>
      )}

      {shouldShowAlternativeBenchmark ? (
        <StyledGroupCell data-testid={`group-value-cell`}>
          {formatNumber(alternativeBenchmarkData?.healthData.at(-1)?.value)}
        </StyledGroupCell>
      ) : null}
      <StyledBenchmarkCell data-testid={`benchmark-value-cell`}>
        {formatNumber(benchmarkQuartileValue)}
      </StyledBenchmarkCell>
      <StyledBenchmarkCell data-testid={`benchmark-worst-cell`}>
        {formatNumber(worst)}
      </StyledBenchmarkCell>
      <StyledBenchmarkChart data-testid={`benchmark-range`}>
        <SpineChart
          key={`spineChart-${benchmarkToUse}`}
          name={indicatorName}
          units={valueUnit}
          period={latestDataPeriod}
          benchmarkName={benchmarkData?.areaName ?? englandAreaString}
          benchmarkValue={benchmarkQuartileValue ?? 0}
          quartileData={quartileData}
          areaOneValue={areasHealthData[0]?.healthData.at(-1)?.value}
          areaTwoValue={areasHealthData[1]?.healthData.at(-1)?.value}
          areaNames={areaNames}
          areaOneOutcome={
            areasHealthData[0]?.healthData.at(-1)?.benchmarkComparison?.outcome
          }
          areaTwoOutcome={
            areasHealthData[1]?.healthData.at(-1)?.benchmarkComparison?.outcome
          }
          alternativeBenchmarkValue={
            shouldShowAlternativeBenchmark
              ? alternativeBenchmarkData?.healthData.at(-1)?.value
              : undefined
          }
          alternativeBenchmarkName={
            shouldShowAlternativeBenchmark
              ? (alternativeBenchmarkData?.areaName ?? '')
              : ''
          }
          alternativeBenchmarkOutcome={
            alternativeBenchmarkData?.healthData.at(-1)?.benchmarkComparison
              ?.outcome
          }
          benchmarkMethod={benchmarkComparisonMethod}
          benchmarkToUse={benchmarkToUse}
        />
      </StyledBenchmarkChart>
      <StyledBenchmarkCell data-testid={`benchmark-best-cell`}>
        {formatNumber(best)}
      </StyledBenchmarkCell>
    </Table.Row>
  );
};
