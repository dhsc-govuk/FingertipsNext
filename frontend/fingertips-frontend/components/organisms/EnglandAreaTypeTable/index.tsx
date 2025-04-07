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
import { englandArea } from '@/mock/data/areas/englandAreas';

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
  period?: string;
  latestEnglandHealthData?: HealthDataPoint;
  unitLabel: string | undefined;
}

interface EnglandAreaTypeTableProps {
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
              <Table.CellHeader colSpan={6}>
                {englandArea.name}
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
              numberStyle={'whole'}
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
