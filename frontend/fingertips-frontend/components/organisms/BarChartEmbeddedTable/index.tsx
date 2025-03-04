'use client'

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';

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
  console.log(healthIndicatorData)
  return (<Table 
    head={<Table.Row>
    <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaName}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaCount}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaValue}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaLower}</Table.CellHeader>
      <Table.CellHeader>{BarChartEmbeddedTableHeadingEnum.AreaUpper}</Table.CellHeader>
  </Table.Row>}>
    §
    
  </Table>)
}
