'use client';

import { Table } from 'govuk-react';
import {
  HealthDataForArea,
  Indicator,
} from '@/generated-sources/ft-api-client';
import React from 'react';
import { StyledDiv } from '@/lib/tableHelpers';

import { SpineChartTableHeader } from './SpineChartTableHeader';

import {
  SpineChartTableRowData,
  SpineChartTableRow,
} from './SpineChartTableRow';

export interface SpineChartTableProps {
  indicators: Indicator[];
  measurementUnits: string[];
  indicatorHealthData: HealthDataForArea[];
  groupIndicatorData: HealthDataForArea[];
  englandBenchmarkData: HealthDataForArea[];
  best: number[];
  worst: number[];
}

export interface SpineChartTableRowProps {
  indicator: Indicator;
  measurementUnit: string;
  indicatorHealthData: HealthDataForArea;
  groupIndicatorData: HealthDataForArea;
  englandBenchmarkData: HealthDataForArea;
  best: number;
  worst: number;
}

export const mapToSpineChartTableData = (
  tableData: SpineChartTableRowProps[]
): SpineChartTableRowData[] =>
  tableData.map((item) => ({
    indicatorId: item.indicator.indicatorId,
    indicator: item.indicator.title,
    unit: item.measurementUnit,
    period: item.indicatorHealthData.healthData[0].year,
    count: item.indicatorHealthData.healthData[0].count,
    value: item.indicatorHealthData.healthData[0].value,
    groupValue: item.groupIndicatorData.healthData[0].value,
    benchmarkValue: item.englandBenchmarkData.healthData[0].value,
    benchmarkBest: item.best,
    benchmarkWorst: item.worst,
  }));

const sortByIndicator = (tableRowData: SpineChartTableRowData[]) =>
  tableRowData.toSorted((a, b) => a.indicatorId - b.indicatorId);

export function SpineChartTable(dataTable: Readonly<SpineChartTableProps>) {
  const areaName = dataTable.rowData[0].indicatorHealthData.areaName;
  const groupName = dataTable.rowData[0].groupIndicatorData.areaName;

  const tableData = mapToSpineChartTableData(dataTable.rowData);
  const sortedData = sortByIndicator(tableData);

  return (
    <StyledDiv data-testid="spineChartTable-component">
      <Table>
        <SpineChartTableHeader areaName={areaName} groupName={groupName} />
        {sortedData.map((row) => (
          <React.Fragment key={row.indicatorId}>
            <SpineChartTableRow
              indicatorId={row.indicatorId}
              indicator={row.indicator}
              unit={row.unit}
              period={row.period}
              count={row.count}
              value={row.value}
              groupValue={row.groupValue}
              benchmarkValue={row.benchmarkValue}
              benchmarkWorst={row.benchmarkWorst}
              benchmarkBest={row.benchmarkBest}
            />
          </React.Fragment>
        ))}
      </Table>
    </StyledDiv>
  );
}
