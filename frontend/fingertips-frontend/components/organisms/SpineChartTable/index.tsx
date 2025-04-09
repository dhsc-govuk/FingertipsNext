'use client';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  Indicator,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import React from 'react';

import { SpineChartTableHeader } from './SpineChartTableHeader';

import {
  SpineChartTableRow,
  SpineChartTableRowData,
} from './SpineChartTableRow';
import { StyledDivTableContainer, StyledTable } from './SpineChartTableStyles';
import { spineChartImproperUsageError } from './spineChartTableHelpers';
import { H2 } from 'govuk-react';
import styled from 'styled-components';
import { SpineChartLegend } from '@/components/organisms/SpineChartLegend/SpineChartLegend';
import { SpineChartQuartilesInfoContainer } from '@/components/organisms/SpineChart/SpineChartQuartilesInfo';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';

const SpineChartHeading = styled(H2)({
  fontSize: '1.5rem',
  marginTop: '1rem',
});

export interface SpineChartTableProps {
  rowData: SpineChartTableRowProps[];
  areasSelected: string[];
}

export interface SpineChartTableRowProps {
  indicator: Indicator;
  measurementUnit: string;
  indicatorHealthDataAreaOne: HealthDataForArea;
  indicatorHealthDataAreaTwo?: HealthDataForArea;
  groupIndicatorData: HealthDataForArea;
  englandBenchmarkData: HealthDataForArea;
  benchmarkStatistics: QuartileData;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
}

/**
 * Checks the latest period for the pre-sorted health data for areas one and two match.
 * I.e. the latest data point for both areas is the same year.
 */
const checkLatestPeriodMatches = (
  rowData: SpineChartTableRowProps
): boolean => {
  return (
    rowData.indicatorHealthDataAreaOne.healthData[0].year ===
    rowData.indicatorHealthDataAreaTwo?.healthData[0].year
  );
};

export const mapToSpineChartTableData = (
  tableData: SpineChartTableRowProps[],
  twoAreasRequested: boolean
): SpineChartTableRowData[] =>
  tableData.map((item) => {
    // Show no value for the second area if it does not have data for the latest period for the first area.
    const showSecondArea = twoAreasRequested && checkLatestPeriodMatches(item);

    const areaOneHealthData = item.indicatorHealthDataAreaOne.healthData[0];
    const areaTwoHealthData = item.indicatorHealthDataAreaTwo?.healthData[0];

    return {
      indicatorId: item.indicator.indicatorId,
      indicator: item.indicator.title,
      unit: item.measurementUnit,
      period: areaOneHealthData.year,
      trend: areaOneHealthData.trend,
      areaOneCount: areaOneHealthData.count,
      areaOneValue: areaOneHealthData.value,
      areaOneOutcome: areaOneHealthData.benchmarkComparison?.outcome,
      areaTwoCount: showSecondArea ? areaTwoHealthData?.count : undefined,
      areaTwoValue: showSecondArea ? areaTwoHealthData?.value : undefined,
      areaTwoOutcome: areaTwoHealthData?.benchmarkComparison?.outcome,
      groupValue: item.groupIndicatorData.healthData[0].value,
      benchmarkValue: item.englandBenchmarkData.healthData[0].value,
      benchmarkStatistics: item.benchmarkStatistics,
      benchmarkComparisonMethod: item.benchmarkComparisonMethod,
      twoAreasRequested,
    };
  });

const sortByIndicator = (tableRowData: SpineChartTableRowData[]) =>
  tableRowData.toSorted((a, b) => a.indicatorId - b.indicatorId);

const getAreaNames = (
  twoAreaRequested: boolean,
  tableRowData: SpineChartTableRowProps
): string[] => {
  return twoAreaRequested
    ? [
        tableRowData.indicatorHealthDataAreaOne.areaName,
        tableRowData.indicatorHealthDataAreaTwo?.areaName ?? '',
      ]
    : [tableRowData.indicatorHealthDataAreaOne.areaName];
};

export function SpineChartTable({
  rowData,
  areasSelected,
}: Readonly<SpineChartTableProps>) {
  if (areasSelected.length < 1 || 2 < areasSelected.length) {
    throw new Error(spineChartImproperUsageError);
  }

  const twoAreasRequested = areasSelected.length === 2;
  const groupName = rowData[0].groupIndicatorData.areaName;

  const mappedTableData = mapToSpineChartTableData(rowData, twoAreasRequested);
  const sortedData = sortByIndicator(mappedTableData);
  const mappedAreaNames = getAreaNames(twoAreasRequested, rowData[0]);
  const methods = getMethodsAndOutcomes(rowData);

  // DHSCFT-582 - extend to allow up to 2 areas. Trends should only show for 1.

  return (
    <>
      <SpineChartHeading>Compare indicators by areas</SpineChartHeading>
      <SpineChartLegend
        legendsToShow={methods}
        groupName={groupName}
        areaNames={mappedAreaNames}
      />
      <SpineChartQuartilesInfoContainer />
      <StyledDivTableContainer data-testid="spineChartTable-component">
        <StyledTable>
          <SpineChartTableHeader
            areaNames={mappedAreaNames}
            groupName={groupName}
          />
          {sortedData.map((row) => (
            <React.Fragment key={row.indicatorId}>
              <SpineChartTableRow
                indicatorId={row.indicatorId}
                indicator={row.indicator}
                unit={row.unit}
                period={row.period}
                trend={row.trend}
                areaOneCount={row.areaOneCount}
                areaOneValue={row.areaOneValue}
                areaOneOutcome={row.areaOneOutcome}
                areaTwoCount={row.areaTwoCount}
                areaTwoValue={row.areaTwoValue}
                areaTwoOutcome={row.areaTwoOutcome}
                groupValue={row.groupValue}
                benchmarkValue={row.benchmarkValue}
                benchmarkStatistics={row.benchmarkStatistics}
                twoAreasRequested={twoAreasRequested}
                benchmarkComparisonMethod={row.benchmarkComparisonMethod}
              />
            </React.Fragment>
          ))}
        </StyledTable>
      </StyledDivTableContainer>
    </>
  );
}
