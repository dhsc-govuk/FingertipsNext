import { InequalitiesBarChartData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import {
  getDisplayedValue,
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
} from '@/lib/tableHelpers';
import { Table } from 'govuk-react';
import React, { ReactNode } from 'react';

interface InequalitiesBarChartTableProps {
  tableData: InequalitiesBarChartData;
  dynamicKeys: string[];
  measurementUnit?: string;
}

export enum InequalitiesBarChartTableHeaders {
  INEQUALITY_TYPE = 'Inequality type',
  COMPARED_TO = 'Compared to Persons',
  COUNT = 'Count',
  VALUE = 'Value',
  LOWER = 'Lower',
  UPPER = 'Upper',
}

const getCellHeader = (
  header: InequalitiesBarChartTableHeaders,
  measurementUnit: string | undefined
): ReactNode =>
  header === InequalitiesBarChartTableHeaders.INEQUALITY_TYPE ? (
    <StyledAlignLeftHeader
      key={`heading-${header}`}
      style={{ width: '16%' }}
      data-testid={`heading-${header}`}
    >
      {header}
    </StyledAlignLeftHeader>
  ) : (
    <StyledAlignRightHeader
      key={`heading-${header}`}
      style={{ width: '16%' }}
      data-testid={`heading-${header}`}
    >
      {header === InequalitiesBarChartTableHeaders.VALUE && measurementUnit ? (
        <>
          {header}
          <span
            data-testid="inequalitiesBarChart-measurementUnit"
            style={{ display: 'block', margin: 'auto' }}
          >{` ${measurementUnit}`}</span>
        </>
      ) : (
        header
      )}
    </StyledAlignRightHeader>
  );

export function InequalitiesBarChartTable({
  tableData,
  dynamicKeys,
  measurementUnit,
}: Readonly<InequalitiesBarChartTableProps>) {
  return (
    <div data-testid="inequalitiesBarChartTable-component">
      <Table
        head={
          <>
            <Table.Row>
              <StyledAlignLeftHeader colSpan={4}>
                {tableData.areaName}
              </StyledAlignLeftHeader>
              <StyledAlignRightHeader
                colSpan={2}
                style={{ paddingRight: '20px' }}
              >
                95% confidence limits
              </StyledAlignRightHeader>
            </Table.Row>
            <Table.Row>
              {Object.values(InequalitiesBarChartTableHeaders).map((header) =>
                getCellHeader(header, measurementUnit)
              )}
            </Table.Row>
          </>
        }
      >
        {dynamicKeys.map((key) => (
          <Table.Row key={key}>
            <StyledAlignLeftTableCell>{key}</StyledAlignLeftTableCell>
            <StyledAlignRightTableCell></StyledAlignRightTableCell>
            <StyledAlignRightTableCell>
              {getDisplayedValue(tableData.data.inequalities[key]?.count)}
            </StyledAlignRightTableCell>
            <StyledAlignRightTableCell>
              {getDisplayedValue(tableData.data.inequalities[key]?.value)}
            </StyledAlignRightTableCell>
            <StyledAlignRightTableCell>
              {getDisplayedValue(tableData.data.inequalities[key]?.lower)}
            </StyledAlignRightTableCell>
            <StyledAlignRightTableCell>
              {getDisplayedValue(tableData.data.inequalities[key]?.upper)}
            </StyledAlignRightTableCell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
