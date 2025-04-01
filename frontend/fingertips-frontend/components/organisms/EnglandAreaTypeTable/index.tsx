'use client';

import {
  HealthDataForArea,
  Indicator,
} from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import { BarChartEmbeddedTableHeadingEnum } from '@/components/organisms/BarChartEmbeddedTable';
import React from 'react';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { CheckValueInTableCell } from '@/components/molecules/CheckValueInTableCell';
import {
  latestSingleHealthDataPoint,
  sortHealthDataByYearDescending,
  sortHealthDataByYearDescending1,
  sortHealthDataPointsByDescendingYear,
} from '@/lib/chartHelpers/chartHelpers';

export enum EnglandAreaTypeTableEnum {
  Indicator = 'Indicator',
  Period = 'Period',
  Count = 'Count',
  ValueUnit = 'Value unit',
  Value = 'Value',
  RecentTrend = 'Recent trend',
}

export interface EnglandAreaTypeTableProps {
  indicator: (Indicator | undefined)[];
  measurementUnit: (string | undefined) [];
  englandBenchmarkData: HealthDataForArea[];
}
export function EnglandAreaTypeTable({
  indicator,
  englandBenchmarkData,
  measurementUnit,
}: Readonly<EnglandAreaTypeTableProps>) {
  
  console.log('EnglandAreaTypeTableIndicator', indicator);
  console.log('EnglandAreaTypeTableenglandBenchmarkData', englandBenchmarkData);
  console.log('EnglandAreaTypeTablemeasurementUnit', measurementUnit);
  
  const orderedEnglandBenchmarkData =  sortHealthDataByYearDescending(englandBenchmarkData)
  console.log('ordered', orderedEnglandBenchmarkData);
  const sortedEnglandBenchmarkData = latestSingleHealthDataPoint(orderedEnglandBenchmarkData)
  console.log('sort', sortedEnglandBenchmarkData)
  
  const mappedSortedEnglandBenchmarkData = sortedEnglandBenchmarkData.map((item) => ({
    period: item.healthData[0].year,
    count: item.healthData[0].count,
    value: item.healthData[0].value,
    trend: item.healthData[0].trend,
  }))
  
  
  //loop through array
  // check if there is data
  // if data then loop through the health data points
  // order from latest to oldest 
  // return the first data point (latest)
  
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
              <CheckValueInTableCell value={item?.title}></CheckValueInTableCell>
            </Table.Row>
          ))
        }

        {mappedSortedEnglandBenchmarkData.map((item, index) => (
          <Table.Row>
            <CheckValueInTableCell value={item.period}></CheckValueInTableCell>
          </Table.Row>
        ))}







      </Table>
    </div>
  );
}
