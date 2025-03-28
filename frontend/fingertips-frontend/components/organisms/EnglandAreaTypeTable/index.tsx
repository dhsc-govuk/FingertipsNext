'use client';

import {
  HealthDataForArea,
  Indicator,
} from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import { BarChartEmbeddedTableHeadingEnum } from '@/components/organisms/BarChartEmbeddedTable';
import React from 'react';

export enum EnglandAreaTypeTableEnum {
  Indicator = 'Indicator',
  Period = 'Period',
  Count = 'Count',
  ValueUnit = 'Value unit',
  Value = 'Value',
  RecentTrend = 'Recent trend',
}

interface EnglandAreaTypeTableProps {
  indicators: Indicator[];
  measurementUnit: string | undefined;
  englandBenchmarkData: HealthDataForArea | undefined;
}
export function EnglandAreaTypeTable({
 indicators,
  englandBenchmarkData,
  measurementUnit,
}: Readonly<EnglandAreaTypeTableProps>) {
  return (
    <div data-testid={'EnglandAreaTypeTable-component'}>
      <Table
        head =
        {
          <React.Fragment>
            <Table.Row>
              <Table.CellHeader colSpan={5}>
                {BarChartEmbeddedTableHeadingEnum.AreaName}
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
      </Table>
    </div>
  );
}
