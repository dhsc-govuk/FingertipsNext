import { Table } from 'govuk-react';
import styled from 'styled-components';
import {
  getDisplayValue,
  StyledAlignLeftStickyTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledAlignStickyLeftHeader,
  StyledDivWithScrolling,
  StyledTableCellHeader,
} from '@/lib/tableHelpers';
import {
  getYearsWithInequalityData,
  InequalitiesChartData,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
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

const getCellHeader = (heading: string, index: number): ReactNode => {
  return heading === InequalitiesTableHeadingsEnum.PERIOD ? (
    <StyledAlignStickyLeftHeader
      data-testid={`header-${heading}-${index}`}
      key={heading + index}
    >
      {heading}
    </StyledAlignStickyLeftHeader>
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

  const yearsWithInequalityData = getYearsWithInequalityData(tableData.rowData);

  return (
    <StyledDivWithScrolling data-testid="inequalitiesLineChartTable-component">
      <Table
        head={
          <>
            <Table.Row>
              <StyledAlignCenterHeader colSpan={tableHeaders.length}>
                {tableData.areaName}
                {measurementUnit ? (
                  <span
                    style={{ display: 'block', marginTop: '10px' }}
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
        {tableData.rowData
          .filter(
            (data) =>
              data.period >= Math.min(...yearsWithInequalityData) &&
              data.period <= Math.max(...yearsWithInequalityData)
          )
          .map((data, index) => (
            <Table.Row key={String(data.period) + index}>
              <StyledAlignLeftStickyTableCell>
                {String(data.period)}
              </StyledAlignLeftStickyTableCell>
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
