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
  englandBenchmarkData?: HealthDataForArea[];
}


export function BarChartEmbeddedTable({healthIndicatorData}: Readonly<BarChartEmbeddedTable>){
  console.log(healthIndicatorData.map((item) => item.areaName))
  const mostRecentYearData = sortHealthDataByYearDescending(healthIndicatorData)
  console.log('mostRecentYearData',mostRecentYearData)
const largestValue = mostRecentYearData.map((item) => ({
  ...item, healthData: item.healthData.toSorted((a, b) => {
    if(a.value === undefined) return 1
    if(b.value === undefined) return 1
    return a.value - b.value})
}))
  console.log('hello',largestValue)
  
  // Math.max(...mostRecentYearData.map(item => item.healthData.map(point => point.value)))
  
  // create a function to loop through descendingHealthIndicatorData and get the first health data point from each array
  // then loop through the extracted data points to find the largest value to put in the table
  
  return (<Table 
    head={<Table.Row>
    <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaName}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaCount}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaValue}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaLower}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaUpper}</Table.CellHeader>
  </Table.Row>}>
    {mostRecentYearData.map((item) => (
      <Table.Row key={`${item.areaName}`}>
        <Table.Cell>
          {item.areaName}
        </Table.Cell>
        <Table.Cell>
          {item.healthData[0].count}
        </Table.Cell>
      </Table.Row>
    ))}
  </Table>)
}
