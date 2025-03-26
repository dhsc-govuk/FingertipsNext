'use client';

import {
  HealthDataForArea,
  Indicator,
} from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';

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
  measurementUnits: string[];
  healthIndicatorData: HealthDataForArea[];
  englandBenchmarkData: HealthDataForArea[];
}
export function EnglandAreaTypeTable({
  indicators,
  englandBenchmarkData,
}: Readonly<EnglandAreaTypeTableProps>) {
  return (
    <div data-testid={'EnglandAreaTypeTable-component'}>
      <Table>
        head=
        {
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
        }
      </Table>
    </div>
  );
}
