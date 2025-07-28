'use client';

import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { Table } from 'govuk-react';
import React from 'react';
import {
  CheckValueInTableCell,
  FormatNumberInTableCell,
} from '@/components/molecules/CheckValueInTableCell';
import { TrendTag } from '@/components/molecules/TrendTag';
import { StyledCenterTableCell } from '@/lib/tableHelpers';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { convertBasicTableToCsvData } from './helpers/convertBasicTableToCsvData';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';
import {
  BasicTableData,
  BasicTableEnum,
} from '@/components/charts/BasicTable/basicTable.types';
import { StyledTable } from '@/components/charts/BasicTable/BasicTable.styles';

interface BasicTableProps {
  tableData: BasicTableData[];
  title?: string;
}

export function BasicTable({
  tableData,
  title = 'Overview of selected indicators',
}: Readonly<BasicTableProps>) {
  const areaName = tableData.at(0)?.areaName;
  const csvData = convertBasicTableToCsvData(tableData);
  const id = 'basic-table';
  return (
    <div data-testid={`${id}-component`}>
      <ContainerWithOutline>
        <div id={id}>
          <ChartTitle>{title}</ChartTitle>
          <StyledTable
            head={
              <React.Fragment>
                <Table.Row>
                  <Table.CellHeader colSpan={6} style={{ paddingLeft: '10px' }}>
                    {areaName}
                  </Table.CellHeader>
                </Table.Row>

                <Table.Row>
                  <Table.CellHeader
                    style={{ verticalAlign: 'top', paddingLeft: '10px' }}
                  >
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
                      textAlign: 'left',
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
            {tableData.map((item) => (
              <Table.Row key={item.indicatorName}>
                <CheckValueInTableCell
                  value={item?.indicatorName}
                  style={{ paddingLeft: '10px' }}
                />
                <CheckValueInTableCell
                  value={item?.period}
                  style={{ textAlign: 'right' }}
                />
                <FormatNumberInTableCell
                  value={item?.count}
                  numberStyle={'whole'}
                  style={{ textAlign: 'right' }}
                />
                <CheckValueInTableCell
                  value={item?.unitLabel}
                  style={{ textAlign: 'left' }}
                />
                <FormatNumberInTableCell
                  value={item?.value}
                  style={{ textAlign: 'right' }}
                />
                <StyledCenterTableCell>
                  <TrendTag
                    trendFromResponse={
                      item?.trend ?? HealthDataPointTrendEnum.CannotBeCalculated
                    }
                  />
                </StyledCenterTableCell>
              </Table.Row>
            ))}
          </StyledTable>
          <ExportOnlyWrapper>
            <ExportCopyright />
          </ExportOnlyWrapper>
        </div>
        <ExportOptionsButton targetId={id} csvData={csvData} />
      </ContainerWithOutline>
    </div>
  );
}
