'use client';

import {
  HealthDataForArea, type HealthDataPoint,
  Indicator,
} from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import React from 'react';
import { CheckValueInTableCell } from '@/components/molecules/CheckValueInTableCell';
import {
  latestSingleHealthDataPoint,
  sortHealthDataByYearDescending,
} from '@/lib/chartHelpers/chartHelpers';

export enum EnglandAreaTypeTableEnum {
  Indicator = 'Indicator',
  Period = 'Period',
  Count = 'Count',
  ValueUnit = 'Value unit',
  Value = 'Value',
  RecentTrend = 'Recent trend',
}

export interface EnglandAreaTypeIndicatorData {
  indicatorId: number | undefined;
  indicatorName: string | undefined;
  period: string | undefined;
  latestEnglandHealthData: HealthDataPoint | undefined;
  unitLabel: string | undefined;
}

export interface EnglandAreaTypeTableProps {
  indicator: EnglandAreaTypeIndicatorData[];
  // englandBenchmarkData: HealthDataForArea[];
}
export function EnglandAreaTypeTable({
  indicator,
  // englandBenchmarkData,
}: Readonly<EnglandAreaTypeTableProps>) {
  
  console.log('EnglandAreaTypeTableIndicator', indicator);
  // console.log('EnglandAreaTypeTableenglandBenchmarkData', englandBenchmarkData);
  
  // const orderedEnglandBenchmarkData =  sortHealthDataByYearDescending(englandBenchmarkData)
  // console.log('ordered', orderedEnglandBenchmarkData);
  // const sortedEnglandBenchmarkData = latestSingleHealthDataPoint(orderedEnglandBenchmarkData)
  // console.log('sort', sortedEnglandBenchmarkData)
  
  // const mappedSortedEnglandBenchmarkData = sortedEnglandBenchmarkData.map((item) => ({
  //   period: item.healthData[0].year,
  //   count: item.healthData[0].count,
  //   value: item.healthData[0].value,
  //   trend: item.healthData[0].trend,
  // }))
  
  
  // const rowData = indicator.map((item, index) => {
  //   return mappedSortedEnglandBenchmarkData[index] || []
  // });
  //
  
  
  
  return (
    <div data-testid={'EnglandAreaTypeTable-component'}>
      <Table
        head={
          <React.Fragment>
            <Table.Row>
              <Table.CellHeader colSpan={5} style={{fontSize: 24}}>
                {"England"}
              </Table.CellHeader>
            </Table.Row>

            <Table.Row>
              <Table.CellHeader>
                {EnglandAreaTypeTableEnum.Indicator}
              </Table.CellHeader>
              <Table.CellHeader>
                {EnglandAreaTypeTableEnum.Period}
              </Table.CellHeader>
              <Table.CellHeader>
                {EnglandAreaTypeTableEnum.Count}
              </Table.CellHeader>
              <Table.CellHeader>
                {EnglandAreaTypeTableEnum.ValueUnit}
              </Table.CellHeader>
              <Table.CellHeader>
                {EnglandAreaTypeTableEnum.Value}
              </Table.CellHeader>
              <Table.CellHeader>
                {EnglandAreaTypeTableEnum.RecentTrend}
              </Table.CellHeader>
            </Table.Row>
          </React.Fragment>
        }>
        
        {indicator.map((item, index) => (
            <Table.Row>
              <CheckValueInTableCell value={item?.indicatorName}></CheckValueInTableCell>
              <CheckValueInTableCell value={item?.period}></CheckValueInTableCell>
              <CheckValueInTableCell value={item?.latestEnglandHealthData?.count}></CheckValueInTableCell>
              <CheckValueInTableCell value={item?.unitLabel}></CheckValueInTableCell>
              <CheckValueInTableCell value={item?.latestEnglandHealthData?.value}></CheckValueInTableCell>
              <CheckValueInTableCell value={item?.latestEnglandHealthData?.trend}></CheckValueInTableCell>
            </Table.Row>
          ))
        }

      </Table>
    </div>
  );
}
