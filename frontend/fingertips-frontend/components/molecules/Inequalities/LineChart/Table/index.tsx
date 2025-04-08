import { Table } from 'govuk-react';
import styled from 'styled-components';
import {
  getDisplayValue,
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledDivWithScrolling,
  StyledTableCellHeader,
} from '@/lib/tableHelpers';
import { InequalitiesChartData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { ReactNode } from 'react';

export enum InequalitiesTableHeadingsEnum {
  PERIOD = 'Period',
}

interface InequalitiesLineChartTableProps {
  tableData: InequalitiesChartData;
  dynamicKeys: string[];
  measurementUnit?: string;
}

const StyledAlignCenterHeader = styled(StyledTableCellHeader)({
  textAlign: 'center',
});

const StyledAlignRightHeaderWithPadding = styled(StyledAlignRightHeader)({
  paddingLeft: '10px',
});

const StyledAlignLeftHeaderWithPadding = styled(StyledAlignLeftHeader)({
  paddingRight: '10px',
});

const getCellHeader = (heading: string, index: number): ReactNode => {
  return heading === InequalitiesTableHeadingsEnum.PERIOD ? (
    <StyledAlignLeftHeaderWithPadding
      data-testid={`header-${heading}-${index}`}
      key={heading + index}
    >
      {heading}
    </StyledAlignLeftHeaderWithPadding>
  ) : (
    <StyledAlignRightHeaderWithPadding
      data-testid={`header-${heading}-${index}`}
      key={heading + index}
    >
      {heading}
    </StyledAlignRightHeaderWithPadding>
  );
};

export function InequalitiesLineChartTable({
  tableData,
  dynamicKeys,
  measurementUnit,
}: Readonly<InequalitiesLineChartTableProps>) {
  const tableHeaders = [
    ...Object.values(InequalitiesTableHeadingsEnum),
    ...dynamicKeys,
  ];

  return (
    <StyledDivWithScrolling data-testid="inequalitiesLineChartTable-component">
      <Table
        head={
          <>
            <Table.Row>
              <StyledAlignCenterHeader colSpan={4}>
                {tableData.areaName}
                {measurementUnit ? (
                  <span
                    style={{ display: 'block', marginTop: '21px' }}
                    data-testid="inequalitiesLineChartTable-measurementUnit"
                  >
                    Value: {measurementUnit}
                  </span>
                ) : null}
              </StyledAlignCenterHeader>
            </Table.Row>
            <Table.Row>
              {tableHeaders.map((heading, index) =>
                getCellHeader(heading, index)
              )}
            </Table.Row>
          </>
        }
      >
        {tableData.rowData.map((data, index) => (
          <Table.Row key={String(data.period) + index}>
            <StyledAlignLeftTableCell>
              {String(data.period)}
            </StyledAlignLeftTableCell>
            {dynamicKeys.map((key, index) => (
              <StyledAlignRightTableCell key={key + index}>
                {getDisplayValue(data.inequalities[key]?.value)}
              </StyledAlignRightTableCell>
            ))}
          </Table.Row>
        ))}
      </Table>
    </StyledDivWithScrolling>
  );
}
