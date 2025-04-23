'use client';

import {
  type HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import React from 'react';
import {
  CheckValueInTableCell,
  FormatNumberInTableCell,
} from '@/components/molecules/CheckValueInTableCell';
import { TrendTag } from '@/components/molecules/TrendTag';

export enum OneAreaMultipleIndicatorsTableEnum {
  Indicator = 'Indicator',
  Period = 'Period',
  Count = 'Count',
  ValueUnit = 'Value unit',
  Value = 'Value',
  RecentTrend = 'Recent trend',
}

export interface OneAreaMultipleIndicatorsData {
  indicatorId?: number;
  indicatorName?: string;
  period?: string;
  latestEnglandHealthData?: HealthDataPoint;
  unitLabel?: string;
}

interface OneAreaMultipleIndicatorsTableProps {
  indicatorData: OneAreaMultipleIndicatorsData[];
  areaName: string;
}

export function OneAreaMultipleIndicatorsTable({
  indicatorData,
  areaName,
}: Readonly<OneAreaMultipleIndicatorsTableProps>) {
  return (
    <div data-testid={'oneAreaMultipleIndicatorsTable-component'}>
      <Table
        head={
          <React.Fragment>
            <Table.Row>
              <Table.CellHeader colSpan={6}>{areaName}</Table.CellHeader>
            </Table.Row>

            <Table.Row>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {OneAreaMultipleIndicatorsTableEnum.Indicator}
              </Table.CellHeader>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {OneAreaMultipleIndicatorsTableEnum.Period}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'right' }}
              >
                {OneAreaMultipleIndicatorsTableEnum.Count}
              </Table.CellHeader>
              <Table.CellHeader
                style={{
                  verticalAlign: 'top',
                  textAlign: 'right',
                }}
              >
                {OneAreaMultipleIndicatorsTableEnum.ValueUnit}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'right' }}
              >
                {OneAreaMultipleIndicatorsTableEnum.Value}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'center' }}
              >
                {OneAreaMultipleIndicatorsTableEnum.RecentTrend}
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
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
              value={item?.latestEnglandHealthData?.count}
              numberStyle={'whole'}
              style={{ textAlign: 'right' }}
            />
            <CheckValueInTableCell
              value={item?.unitLabel}
              style={{ textAlign: 'right' }}
            />
            <FormatNumberInTableCell
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
