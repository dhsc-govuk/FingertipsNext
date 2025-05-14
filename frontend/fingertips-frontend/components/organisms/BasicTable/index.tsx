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
import { StyledCenterTrendColumn } from '@/lib/tableHelpers';

export enum BasicTableEnum {
  Indicator = 'Indicator',
  Period = 'Period',
  Count = 'Count',
  ValueUnit = 'Value unit',
  Value = 'Value',
  RecentTrend = 'Recent trend',
}

export interface BasicTableData {
  indicatorId?: number;
  indicatorName?: string;
  period?: string;
  latestEnglandHealthData?: HealthDataPoint;
  unitLabel?: string;
}

interface BasicTableProps {
  indicatorData: BasicTableData[];
  areaName: string;
}

export function BasicTable({
  indicatorData,
  areaName,
}: Readonly<BasicTableProps>) {
  return (
    <div data-testid={'basicTable-component'}>
      <Table
        head={
          <React.Fragment>
            <Table.Row>
              <Table.CellHeader colSpan={6} style={{paddingLeft: '10px'}}>{areaName}</Table.CellHeader>
            </Table.Row>

            <Table.Row>
              <Table.CellHeader style={{ verticalAlign: 'top', paddingLeft: '10px' }}>
                {BasicTableEnum.Indicator}
              </Table.CellHeader>
              <Table.CellHeader style={{ verticalAlign: 'top' }}>
                {BasicTableEnum.Period}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'right' }}
              >
                {BasicTableEnum.Count}
              </Table.CellHeader>
              <Table.CellHeader
                style={{
                  verticalAlign: 'top',
                  textAlign: 'right',
                }}
              >
                {BasicTableEnum.ValueUnit}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'right' }}
              >
                {BasicTableEnum.Value}
              </Table.CellHeader>
              <Table.CellHeader
                style={{ verticalAlign: 'top', textAlign: 'center' }}
              >
                {BasicTableEnum.RecentTrend}
              </Table.CellHeader>
            </Table.Row>
          </React.Fragment>
        }
      >
        {indicatorData.map((item) => (
          <Table.Row key={item.indicatorId}>
            <CheckValueInTableCell value={item?.indicatorName} style={{ paddingLeft: '10px' }} />
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
            <StyledCenterTrendColumn>
              <TrendTag
                trendFromResponse={
                  item?.latestEnglandHealthData?.trend ??
                  HealthDataPointTrendEnum.CannotBeCalculated
                }
              />
            </StyledCenterTrendColumn>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
