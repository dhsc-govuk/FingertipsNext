'use client';

import {
  type HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import React from 'react';
import { CheckValueInTableCell } from '@/components/molecules/CheckValueInTableCell';
import { TrendTag } from '@/components/molecules/TrendTag';

export enum EnglandAreaTypeTableEnum {
  Indicator = 'Indicator',
  Period = 'Period',
  Count = 'Count',
  ValueUnit = 'Value unit',
  Value = 'Value',
  RecentTrend = 'Recent trend',
}

export enum EnglandAreaTypeHeaderEnum {
  England = 'England',
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
    <div data-testid={'englandAreaTypeTable-component'}>
      <Table
        head={
          <React.Fragment>
            <Table.Row>
              <Table.CellHeader colSpan={6} style={{ fontSize: 24 }}>
                {EnglandAreaTypeHeaderEnum.England}
              </Table.CellHeader>
            </Table.Row>

            <Table.Row>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {EnglandAreaTypeTableEnum.Indicator}
              </Table.CellHeader>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {EnglandAreaTypeTableEnum.Period}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'right' }}
              >
                {EnglandAreaTypeTableEnum.Count}
              </Table.CellHeader>
              <Table.CellHeader
                style={{
                  verticalAlign: 'top',
                  textAlign: 'right',
                }}
              >
                {EnglandAreaTypeTableEnum.ValueUnit}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'right' }}
              >
                {EnglandAreaTypeTableEnum.Value}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'center' }}
              >
                {EnglandAreaTypeTableEnum.RecentTrend}
              </Table.CellHeader>
            </Table.Row>
          </React.Fragment>
        }
      >
        {indicatorData.map((item) => (
          <Table.Row key={item.indicatorId}>
            <CheckValueInTableCell value={item?.indicatorName} />
            <CheckValueInTableCell
              value={item?.period}
              style={{ textAlign: 'center' }}
            />
            <CheckValueInTableCell
              value={item?.latestEnglandHealthData?.count}
              style={{ textAlign: 'right' }}
            />
            <CheckValueInTableCell
              value={item?.unitLabel}
              style={{ textAlign: 'right' }}
            />
            <CheckValueInTableCell
              value={item?.latestEnglandHealthData?.value}
              style={{ textAlign: 'right' }}
            />
            <Table.Cell>
              <TrendTag
                trendFromResponse={
                  item?.latestEnglandHealthData?.trend ??
                  HealthDataPointTrendEnum.CannotBeCalculated
                }
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
