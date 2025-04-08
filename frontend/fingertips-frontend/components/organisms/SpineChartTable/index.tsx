'use client';
import {
  HealthDataForArea,
  Indicator,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import React from 'react';

import { SpineChartTableHeader } from './SpineChartTableHeader';

import {
  SpineChartTableRowData,
  SpineChartTableRow,
} from './SpineChartTableRow';
import { StyledDivTableContainer, StyledTable } from './SpineChartTableStyles';
import { spineChartImproperUsageError } from './spineChartTableHelpers';

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

    return {
      indicatorId: item.indicator.indicatorId,
      indicator: item.indicator.title,
      unit: item.measurementUnit,
      period: item.indicatorHealthDataAreaOne.healthData[0].year,
      trend: item.indicatorHealthDataAreaOne.healthData[0].trend,
      areaOneCount: item.indicatorHealthDataAreaOne.healthData[0].count,
      areaOneValue: item.indicatorHealthDataAreaOne.healthData[0].value,
      areaTwoCount: showSecondArea
        ? item.indicatorHealthDataAreaTwo?.healthData[0].count
        : undefined,
      areaTwoValue: showSecondArea
        ? item.indicatorHealthDataAreaTwo?.healthData[0].value
        : undefined,
      groupValue: item.groupIndicatorData.healthData[0].value,
      benchmarkValue: item.englandBenchmarkData.healthData[0].value,
      benchmarkStatistics: item.benchmarkStatistics,
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
  return (
    <StyledDivTableContainer data-testid="spineChartTable-component">
      <StyledTable>
        <SpineChartTableHeader
          areaNames={mappedAreaNames}
          twoAreasRequested={twoAreasRequested}
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
              areaTwoCount={row.areaTwoCount}
              areaTwoValue={row.areaTwoValue}
              groupValue={row.groupValue}
              benchmarkValue={row.benchmarkValue}
              benchmarkStatistics={row.benchmarkStatistics}
              twoAreasRequested={twoAreasRequested}
            />
          </React.Fragment>
        ))}
      </StyledTable>
    </StyledDivTableContainer>
  );
}
