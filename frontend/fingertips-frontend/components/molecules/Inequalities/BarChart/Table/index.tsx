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
  GROUPING_TYPES = 'Grouping types',
  COMPARED_TO = 'Compared to',
  COUNT = 'Count',
  VALUE = 'Value',
  LOWER = 'Lower',
  UPPER = 'Upper',
}

const getCellHeader = (
  header: InequalitiesBarChartTableHeaders,
  areaName: string
): ReactNode => {
  if (header === InequalitiesBarChartTableHeaders.COMPARED_TO)
    return (
      <StyledAlignRightHeader
        style={{ width: '16%' }}
        key={`heading-${header}`}
        data-testid={`heading-${header}`}
      >
        {header} <br /> {areaName}
      </StyledAlignRightHeader>
    );
  return header === InequalitiesBarChartTableHeaders.GROUPING_TYPES ? (
    <StyledAlignLeftHeader
      key={`heading-${header}`}
      data-testid={`heading-${header}`}
    >
      {header}
    </StyledAlignLeftHeader>
  ) : (
    <StyledAlignRightHeader
      key={`heading-${header}`}
      data-testid={`heading-${header}`}
    >
      {header}
    </StyledAlignRightHeader>
  );
};

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
              <StyledAlignRightHeader
                colSpan={6}
                style={{ paddingRight: '30px' }}
              >
                95% confidence limits
              </StyledAlignRightHeader>
            </Table.Row>
            <Table.Row>
              {Object.values(InequalitiesBarChartTableHeaders).map((header) =>
                getCellHeader(header, tableData.areaName)
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
