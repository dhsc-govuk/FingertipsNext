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

export interface SpineChartTableProps {
  rowData: SpineChartTableRowProps[];
}

export interface SpineChartTableRowProps {
  indicator: Indicator;
  measurementUnit: string;
  indicatorHealthData: HealthDataForArea;
  groupIndicatorData: HealthDataForArea;
  englandBenchmarkData: HealthDataForArea;
  benchmarkStatistics: QuartileData;
}

export const mapToSpineChartTableData = (
  tableData: SpineChartTableRowProps[]
): SpineChartTableRowData[] =>
  tableData.map((item) => ({
    indicatorId: item.indicator.indicatorId,
    indicator: item.indicator.title,
    unit: item.measurementUnit,
    period: item.indicatorHealthData.healthData[0].year,
    trend: item.indicatorHealthData.healthData[0].trend,
    count: item.indicatorHealthData.healthData[0].count,
    value: item.indicatorHealthData.healthData[0].value,
    groupValue: item.groupIndicatorData.healthData[0].value,
    benchmarkValue: item.englandBenchmarkData.healthData[0].value,
    benchmarkStatistics: item.benchmarkStatistics,
  }));

const sortByIndicator = (tableRowData: SpineChartTableRowData[]) =>
  tableRowData.toSorted((a, b) => a.indicatorId - b.indicatorId);

export function SpineChartTable(dataTable: Readonly<SpineChartTableProps>) {
  const areaName = dataTable.rowData[0].indicatorHealthData.areaName;
  const groupName = dataTable.rowData[0].groupIndicatorData.areaName;

  const tableData = mapToSpineChartTableData(dataTable.rowData);
  const sortedData = sortByIndicator(tableData);

  // DHSCFT-582 - extend to allow up to 2 areas. Trends should only show for 1.
  return (
    <StyledDivTableContainer data-testid="spineChartTable-component">
      <StyledTable>
        <SpineChartTableHeader areaName={areaName} groupName={groupName} />
        {sortedData.map((row) => (
          <React.Fragment key={row.indicatorId}>
            <SpineChartTableRow
              indicatorId={row.indicatorId}
              indicator={row.indicator}
              unit={row.unit}
              period={row.period}
              trend={row.trend}
              count={row.count}
              value={row.value}
              groupValue={row.groupValue}
              benchmarkValue={row.benchmarkValue}
              benchmarkStatistics={row.benchmarkStatistics}
            />
          </React.Fragment>
        ))}
      </StyledTable>
    </StyledDivTableContainer>
  );
}
