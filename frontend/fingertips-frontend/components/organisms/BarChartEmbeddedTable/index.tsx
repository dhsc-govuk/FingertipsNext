'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import {
  sortHealthDataByYearDescending,
  sortHealthDataPointsByDescendingYear,
} from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';

export enum BarChartEmbeddedTableHeadingEnum {
  AreaName = 'Area',
  Count = 'Count',
  Value = 'Value',
  Lower = 'Lower',
  Upper = 'Upper',
}

interface BarChartEmbeddedTableProps {
  healthIndicatorData: HealthDataForArea[];
  benchmarkData?: HealthDataForArea;
  groupIndicatorData?: HealthDataForArea;
}

export function BarChartEmbeddedTable({
  healthIndicatorData,
  benchmarkData,
  groupIndicatorData,
}: Readonly<BarChartEmbeddedTableProps>) {
  const mostRecentYearData =
    sortHealthDataByYearDescending(healthIndicatorData);

  const tableRows = mostRecentYearData.map((item) => ({
    area: item.areaName,
    count: item.healthData[0].count,
    value: item.healthData[0].value,
    lowerCi: item.healthData[0].lowerCi,
    upperCi: item.healthData[0].upperCi,
  }));

  const sortedTableRows = tableRows.toSorted((a, b) => {
    if (!a.value && !b.value) return 0;
    if (!a.value) return 1;
    if (!b.value) return -1;
    return b.value - a.value;
  });

  const sortedHealthDataForBenchmark = sortHealthDataPointsByDescendingYear(
    benchmarkData?.healthData
  );

  const mostRecentHealthDataForBenchmark =
    sortedHealthDataForBenchmark.length > 0
      ? sortedHealthDataForBenchmark[0]
      : undefined;

  const mostRecentBenchmarkData = mostRecentHealthDataForBenchmark
    ? {
        area: benchmarkData?.areaName,
        count: mostRecentHealthDataForBenchmark.count,
        value: mostRecentHealthDataForBenchmark.value,
        lowerCi: mostRecentHealthDataForBenchmark.lowerCi,
        upperCi: mostRecentHealthDataForBenchmark.upperCi,
      }
    : undefined;

  const sortedGroupHealthData = sortHealthDataPointsByDescendingYear(
    groupIndicatorData?.healthData
  );
  const mostRecentGroupHealthData =
    sortedGroupHealthData.length > 0 ? sortedGroupHealthData[0] : undefined;

  const mostRecentGroupData = mostRecentGroupHealthData
    ? {
        area: groupIndicatorData?.areaName,
        count: mostRecentGroupHealthData.count,
        value: mostRecentGroupHealthData.value,
        lowerCi: mostRecentGroupHealthData.lowerCi,
        upperCi: mostRecentGroupHealthData.upperCi,
      }
    : undefined;

  const checkIfValueExists = (value: string | number | undefined) => {
    return (
      <Table.Cell aria-label={!value ? 'Not compared' : undefined}>
        {!value ? 'X' : value}
      </Table.Cell>
    );
  };

  return (
    <div data-testid={'barChartEmbeddedTable-component'}>
      <Table
        head={
          <Table.Row>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.AreaName}
            </Table.CellHeader>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.Count}
            </Table.CellHeader>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.Value} %
            </Table.CellHeader>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.Lower}
            </Table.CellHeader>
            <Table.CellHeader>
              {BarChartEmbeddedTableHeadingEnum.Upper}
            </Table.CellHeader>
          </Table.Row>
        }
      >
        {mostRecentBenchmarkData ? (
          <Table.Row
            key={`${mostRecentBenchmarkData.area}`}
            style={{ backgroundColor: GovukColours.MidGrey }}
            data-testid="table-row-benchmark"
          >
            {checkIfValueExists(mostRecentBenchmarkData.area)}
            {checkIfValueExists(mostRecentBenchmarkData.count)}
            {checkIfValueExists(mostRecentBenchmarkData.value)}
            {checkIfValueExists(mostRecentBenchmarkData.lowerCi)}
            {checkIfValueExists(mostRecentBenchmarkData.upperCi)}
          </Table.Row>
        ) : null}

        {mostRecentGroupData ? (
          <Table.Row
            key={`${mostRecentGroupData.area}`}
            style={{ backgroundColor: GovukColours.LightGrey }}
            data-testid="table-row-group"
          >
            {checkIfValueExists(mostRecentGroupData.area)}
            {checkIfValueExists(mostRecentGroupData.count)}
            {checkIfValueExists(mostRecentGroupData.value)}
            {checkIfValueExists(mostRecentGroupData.lowerCi)}
            {checkIfValueExists(mostRecentGroupData.upperCi)}
          </Table.Row>
        ) : null}

        {sortedTableRows.map((item) => (
          <Table.Row key={`${item.area}`}>
            {checkIfValueExists(item.area)}
            {checkIfValueExists(item.count)}
            {checkIfValueExists(item.value)}
            {checkIfValueExists(item.lowerCi)}
            {checkIfValueExists(item.upperCi)}
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
