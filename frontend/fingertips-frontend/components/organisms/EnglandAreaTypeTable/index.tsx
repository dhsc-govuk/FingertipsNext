'use client';

import {
  type HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import React from 'react';
import { CheckValueInTableCell } from '@/components/molecules/CheckValueInTableCell';


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
  indicatorData: EnglandAreaTypeIndicatorData[];
}
export function EnglandAreaTypeTable({
  indicatorData,
}: Readonly<EnglandAreaTypeTableProps>) {
  return (
    <div data-testid={'EnglandAreaTypeTable-component'}>
      <Table
        head={
          <React.Fragment>
            <Table.Row>
              <Table.CellHeader colSpan={6} style={{ fontSize: 24 }}>
                {'England'}
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
        }
      >
        {indicatorData.map((item) => (
          <Table.Row key={item.indicatorId}>
            <CheckValueInTableCell
              value={item?.indicatorName}
            ></CheckValueInTableCell>
            <CheckValueInTableCell value={item?.period}></CheckValueInTableCell>
            <CheckValueInTableCell
              value={item?.latestEnglandHealthData?.count}
            ></CheckValueInTableCell>
            <CheckValueInTableCell
              value={item?.unitLabel}
            ></CheckValueInTableCell>
            <CheckValueInTableCell
              value={item?.latestEnglandHealthData?.value}
            ></CheckValueInTableCell>
            <CheckValueInTableCell
              value={item?.latestEnglandHealthData?.trend}
            ></CheckValueInTableCell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
