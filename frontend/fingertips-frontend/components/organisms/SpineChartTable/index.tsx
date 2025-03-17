'use client';

import { Table } from 'govuk-react';
import {
  HealthDataForArea,
  Indicator,
} from '@/generated-sources/ft-api-client';
import React from 'react';
import { StyledDiv } from '@/lib/tableHelpers';

import { SpineChartTableHeader } from './SpineChartTableHeader';

import { SpineChartTableRow } from './SpineChartTableRow';

export interface SpineChartTableRowData {
  indicatorId: number;
  indicator: string;
  unit: string;
  period: number;
  count?: number;
  value?: number;
  groupValue?: number;
  benchmarkValue?: number;
  benchmarkWorst?: number;
  benchmarkBest?: number;
}

export interface SpineChartMissingData {
  value?: number;
}

export interface SpineChartTableProps {
  indicators: Indicator[];
  measurementUnits: string[];
  indicatorHealthData: HealthDataForArea[];
  groupIndicatorData: HealthDataForArea[];
  englandBenchmarkData: HealthDataForArea[];
  best: number[];
  worst: number[];
}

export const mapToSpineChartTableData = (
  indicators: Indicator[],
  measurementUnits: string[],
  indicatorHealthData: HealthDataForArea[],
  groupIndicatorData: HealthDataForArea[],
  englandBenchmarkData: HealthDataForArea[],
  best: number[],
  worst: number[]
): SpineChartTableRowData[] =>
  indicators.map((item, index) => ({
    indicatorId: item.indicatorId,
    indicator: item.title,
    unit: measurementUnits[index],
    period: indicatorHealthData[index].healthData[0].year,
    count: indicatorHealthData[index].healthData[0].count,
    value: indicatorHealthData[index].healthData[0].value,
    groupValue: groupIndicatorData[index].healthData[0].value,
    benchmarkValue: englandBenchmarkData[index].healthData[0].value,
    benchmarkBest: best[index],
    benchmarkWorst: worst[index],
  }));

const sortByIndicator = (
  tableRowData: SpineChartTableRowData[]
): SpineChartTableRowData[] =>
  tableRowData.toSorted((a, b) => a.indicatorId - b.indicatorId);

export function SpineChartTable({
  indicators,
  measurementUnits,
  indicatorHealthData,
  groupIndicatorData,
  englandBenchmarkData,
  worst,
  best,
}: Readonly<SpineChartTableProps>) {
  const tableData = mapToSpineChartTableData(
    indicators,
    measurementUnits,
    indicatorHealthData,
    groupIndicatorData,
    englandBenchmarkData,
    best,
    worst
  );
  const sortedData = sortByIndicator(tableData);

  return (
    <StyledDiv data-testid="spineChartTable-component">
      <Table>
        <SpineChartTableHeader
          areaName={indicatorHealthData[0].areaName}
          groupName={groupIndicatorData[0].areaName}
        />
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
