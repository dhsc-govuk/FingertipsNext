'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import { sortHealthDataByYearDescending } from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';

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
  groupIndicatorData?: HealthDataForArea;
}

export function BarChartEmbeddedTable({
  healthIndicatorData,
  benchmarkData, groupIndicatorData,
}: Readonly<BarChartEmbeddedTable>) {
  
  const mostRecentYearData = sortHealthDataByYearDescending(healthIndicatorData);
  
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
  
const sortedGroupData = groupIndicatorData
  ? sortHealthDataByYearDescending([groupIndicatorData])
  : undefined;
  
  const group = sortedGroupData?.map((item) => ({
    area: item.areaName,
    count: item.healthData[0].count,
    value: item.healthData[0].value,
    lowerCi: item.healthData[0].lowerCi,
    upperCi: item.healthData[0].upperCi,
  }))
  
  
  // return 1 so dont need to map through
  function sortMostRecentBenchmark(
    benchmarkData: (HealthDataForArea | undefined)[]
  ) {
    return benchmarkData?.map((item) => ({
      ...item,
      healthData: item?.healthData.toSorted((a, b) => b.year - a.year)[0],
    }));
  }

  const mostRecentBenchmarkData = sortMostRecentBenchmark([benchmarkData]);
  
  const checkIfValueExists = (value: any) => {
    return (
      <Table.Cell aria-label={!value ? "Not compared" : undefined}>{!value ? "X" : value}</Table.Cell>
    )
  };
  
  return (
    <div data-testid={"barChartEmbeddedTable-component"}>
      <Table
        head={
        <Table.Row>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaName}
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaCount}
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaValue} %
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaLower}
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaUpper}
          </Table.CellHeader>
        </Table.Row>
      }>
        {/*dont need to map through because its should just be one or zero*/}
        {mostRecentBenchmarkData.map((item) => (
          <Table.Row key={`${item.areaName}`} style={{backgroundColor: GovukColours.MidGrey}} data-testid="table-row-benchmark">
            {checkIfValueExists(item.areaName)}
            {checkIfValueExists(item.healthData?.count)}
            {checkIfValueExists(item.healthData?.value)}
            {checkIfValueExists(item.healthData?.lowerCi)}
            {checkIfValueExists(item.healthData?.upperCi)}
          </Table.Row>
        ))}

    {/*dont need to map through because its should just be one or zero*/}
        {group?.map((item) => (
          <Table.Row key={`${item.area}`} style={{backgroundColor: GovukColours.LightGrey}} data-testid="table-row-group">
            {checkIfValueExists(item.area)}
            {checkIfValueExists(item.count)}
            {checkIfValueExists(item.value)}
            {checkIfValueExists(item.lowerCi)}
            {checkIfValueExists(item.upperCi)}
          </Table.Row>
        ))}

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
