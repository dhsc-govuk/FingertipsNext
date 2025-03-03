import { Table } from 'govuk-react';
import styled from 'styled-components';
import {
  getDisplayedValue,
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledDiv,
  StyledTableCellHeader,
} from '@/lib/tableHelpers';
import {
  getDynamicKeys,
  Inequalities,
  InequalitiesLineChartTableData,
  YearlyHealthDataGroupedByInequalities,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { ReactNode } from 'react';

export enum InequalitiesTableHeadingsEnum {
  PERIOD = 'Period',
}

interface InequalitiesLineChartTableProps {
  tableData: InequalitiesLineChartTableData;
  yearlyHealthDataGroupedByInequalities: YearlyHealthDataGroupedByInequalities;
  type?: Inequalities;
}

const StyledAlignCenterHeader = styled(StyledTableCellHeader)({
  textAlign: 'center',
});

const getCellHeader = (heading: string, index: number): ReactNode => {
  return heading === InequalitiesTableHeadingsEnum.PERIOD ? (
    <StyledAlignLeftHeader
      data-testid={`header-${heading}-${index}`}
      key={heading + index}
    >
      {heading}
    </StyledAlignLeftHeader>
  ) : (
    <StyledAlignRightHeader
      data-testid={`header-${heading}-${index}`}
      key={heading + index}
    >
      {heading}
    </StyledAlignRightHeader>
  );
};

export function InequalitiesLineChartTable({
  tableData,
  yearlyHealthDataGroupedByInequalities,
  type = Inequalities.Sex,
}: Readonly<InequalitiesLineChartTableProps>) {
  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
    type
  );

  const tableHeaders = [
    ...Object.values(InequalitiesTableHeadingsEnum),
    ...dynamicKeys,
  ];

  return (
    <StyledDiv data-testid="inequalitiesLineChartTable-component">
      <Table
        head={
          <>
            <Table.Row>
              <StyledAlignCenterHeader colSpan={4}>
                {tableData.areaName}
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
                {getDisplayedValue(data.inequalities[key]?.value)}
              </StyledAlignRightTableCell>
            ))}
          </Table.Row>
        ))}
      </Table>
    </StyledDiv>
  );
}
