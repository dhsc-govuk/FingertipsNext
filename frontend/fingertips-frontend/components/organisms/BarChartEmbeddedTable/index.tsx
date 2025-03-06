'use client'

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import { sortHealthDataByYearDescending, sortHealthDataForAreasByDate } from '@/lib/chartHelpers/chartHelpers';

export enum BarChartEmbeddedTableHeadingEnum {
  AreaName = 'Area',
  AreaCount = 'Count',
  AreaValue = 'Value',
  AreaLower = 'Lower',
  AreaUpper = 'Upper'
}

interface BarChartEmbeddedTable {
  healthIndicatorData: HealthDataForArea[];
  benchmarkData?: HealthDataForArea;
}


export function BarChartEmbeddedTable({healthIndicatorData, benchmarkData}: Readonly<BarChartEmbeddedTable>){
    const mostRecentYearData = sortHealthDataByYearDescending(healthIndicatorData)
  console.log('mostRecentYearData',mostRecentYearData)
  
  const largestValue = mostRecentYearData.map((item)=> ({
  ...item, healthData: item.healthData[0]
}));
    
    function sortMostRecentBenchmark(benchmarkData: (HealthDataForArea | undefined)[]) {
      return benchmarkData?.map((item)=> ({
        ...item, healthData: item?.healthData.toSorted((a, b) => b.year - a.year)[0]
      }))
    }
    
    const mostRecentBenchmarkData = sortMostRecentBenchmark([benchmarkData])
    
  console.log('benchmarkdata',benchmarkData)
  console.log('sortMostRecentBenchmark', mostRecentBenchmarkData)
  
  return (<Table 
    head={<Table.Row>
    <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaName}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaCount}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaValue}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaLower}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaUpper}</Table.CellHeader>
  </Table.Row>}>

    {mostRecentBenchmarkData.map((item) => (
      <Table.Row key={`${item.areaName}`}>
        <Table.Cell>
          {item.areaName}
        </Table.Cell>
        <Table.Cell>
          {item.healthData?.count}
        </Table.Cell>
        <Table.Cell>
          {item.healthData?.value}
        </Table.Cell>
        <Table.Cell>
          {item.healthData?.lowerCi}
        </Table.Cell>
        <Table.Cell>
          {item.healthData?.upperCi}
        </Table.Cell>
        </Table.Row>
      ))}
    
    {largestValue.map((item) => (
      <Table.Row key={`${item.areaName}`}>
        <Table.Cell>
          {item.areaName}
        </Table.Cell>
        <Table.Cell>
          {item.healthData.count}
        </Table.Cell>
        <Table.Cell>
          {item.healthData.value}
        </Table.Cell>
        <Table.Cell>
          {item.healthData.lowerCi}
        </Table.Cell>
        <Table.Cell>
          {item.healthData.upperCi}
        </Table.Cell>
      </Table.Row>
    ))}
  </Table>)
}
