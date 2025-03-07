'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import { sortHealthDataByYearDescending } from '@/lib/chartHelpers/chartHelpers';

export enum BarChartEmbeddedTableHeadingEnum {
  AreaName = 'Area',
  AreaCount = 'Count',
  AreaValue = 'Value',
  AreaLower = 'Lower',
  AreaUpper = 'Upper',
}

interface BarChartEmbeddedTable {
  healthIndicatorData: HealthDataForArea[];
  benchmarkData?: HealthDataForArea;
}

export function BarChartEmbeddedTable({
  healthIndicatorData,
  benchmarkData,
}: Readonly<BarChartEmbeddedTable>) {
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
    if (!a.value) return -1;
    if (!b.value) return 1;
    return b.value - a.value;
  });

  function sortMostRecentBenchmark(
    benchmarkData: (HealthDataForArea | undefined)[]
  ) {
    return benchmarkData?.map((item) => ({
      ...item,
      healthData: item?.healthData.toSorted((a, b) => b.year - a.year)[0],
    }));
  }

  const mostRecentBenchmarkData = sortMostRecentBenchmark([benchmarkData]);

  return (
    <Table data-testid="barChartEmbeddedTable-component">
      head={
        <Table.Row>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaName}
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaCount}
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaValue}
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaLower}
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaUpper}
          </Table.CellHeader>
        </Table.Row>
      }
      {mostRecentBenchmarkData.map((item) => (
        <Table.Row key={`${item.areaName}`}>
          <Table.Cell>{item.areaName}</Table.Cell>
          <Table.Cell>{item.healthData?.count}</Table.Cell>
          <Table.Cell>{item.healthData?.value}</Table.Cell>
          <Table.Cell>{item.healthData?.lowerCi}</Table.Cell>
          <Table.Cell>{item.healthData?.upperCi}</Table.Cell>
        </Table.Row>
      ))}

      {sortedTableRows.map((item) => (
        <Table.Row key={`${item.area}`}>
          <Table.Cell>{item.area}</Table.Cell>
          <Table.Cell>{item.count}</Table.Cell>
          <Table.Cell>{item.value}</Table.Cell>
          <Table.Cell>{item.lowerCi}</Table.Cell>
          <Table.Cell>{item.upperCi}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
