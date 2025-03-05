import {
  getDynamicKeys,
  Inequalities,
  InequalitiesBarChartTableData,
  YearlyHealthDataGroupedByInequalities,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
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
  tableData: InequalitiesBarChartTableData;
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities;
  type?: Inequalities;
}

export enum InequalitiesBarChartTableHeaders {
  GROUPING_TYPES = 'Groups',
  COMPARED_TO = 'Compared to Persons',
  COUNT = 'Count',
  VALUE = 'Value',
  LOWER = 'Lower',
  UPPER = 'Upper',
}

const getCellHeader = (header: InequalitiesBarChartTableHeaders): ReactNode =>
  header === InequalitiesBarChartTableHeaders.GROUPING_TYPES ? (
    <StyledAlignLeftHeader
      key={`heading-${header}`}
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
      {header}
    </StyledAlignRightHeader>
  );

export function InequalitiesBarChartTable({
  tableData,
  yearlyHealthDataGroupedByInequalities,
  type = Inequalities.Sex,
}: Readonly<InequalitiesBarChartTableProps>) {
  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
    type
  );

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
                getCellHeader(header)
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
