'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import { sortHealthDataByYearDescending } from '@/lib/chartHelpers/chartHelpers';
import { group } from '@actions/core';

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
  const mostRecentYearData =
    sortHealthDataByYearDescending(healthIndicatorData);
console.log('groupIndicatorData',groupIndicatorData)
  console.log('healthIndicatorData',healthIndicatorData)
  
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

  // TO DO
  // map through group indicator data - display most recent year
  // only show group indicator data if Area selected is not england
  
  
  const group = groupIndicatorData?.healthData.map((item) => ({
    count: item.count,
    value: item.value,
    lowerCi: item.lowerCi,
    upperCi: item.upperCi,
  }))
console.log(group)
  
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
            {BarChartEmbeddedTableHeadingEnum.AreaValue}
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaLower}
          </Table.CellHeader>
          <Table.CellHeader>
            {BarChartEmbeddedTableHeadingEnum.AreaUpper}
          </Table.CellHeader>
        </Table.Row>
      }>
        {mostRecentBenchmarkData.map((item) => (
          <Table.Row key={`${item.areaName}`}>
            {checkIfValueExists(item.areaName)}
            {checkIfValueExists(item.healthData?.count)}
            {checkIfValueExists(item.healthData?.value)}
            {checkIfValueExists(item.healthData?.lowerCi)}
            {checkIfValueExists(item.healthData?.upperCi)}
          </Table.Row>
        ))}

        {/*{group?.map((item) => (*/}
        {/*  <Table.Row key={`${item.count}`}>*/}
        {/*    {checkIfValueExists(item.count)}*/}
        {/*    <Table.Cell>{item.value}</Table.Cell>*/}
        {/*    <Table.Cell>{item.lowerCi}</Table.Cell>*/}
        {/*    <Table.Cell>{item.upperCi}</Table.Cell>*/}
        {/*  </Table.Row>*/}
        {/*))}*/}
        
        

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
