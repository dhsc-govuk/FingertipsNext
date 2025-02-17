import { Table } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { InequalitiesSexTableHeadingsEnum } from '@/lib/tableHelpers';

interface InequalitiesSexTableProps {
  healthIndicatorData: HealthDataForArea;
}

const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 14 }),
  {
    fontWeight: 'bold',
    padding: '0.625em 0',
  }
);

const StyledTableCell = styled(Table.Cell)(typography.font({ size: 14 }));

const StyledAlignLeftHeader = styled(StyledTableCellHeader)({
  textAlign: 'left',
});

const StyledAlignRightHeader = styled(StyledTableCellHeader)({
  textAlign: 'right',
});

const StyledAlignCenterHeader = styled(StyledTableCellHeader)({
  textAlign: 'center',
});

const StyledAlignRightCell = styled(StyledTableCell)({
  textAlign: 'right',
});

export function InequalitiesSexTable({
  healthIndicatorData,
}: Readonly<InequalitiesSexTableProps>) {
  return (
    <Table
      head={
        <>
          <Table.Row>
            <StyledAlignCenterHeader colSpan={4}>
              {healthIndicatorData.areaName}
            </StyledAlignCenterHeader>
            <Table.CellHeader></Table.CellHeader>
          </Table.Row>
          <Table.Row>
            {Object.values(InequalitiesSexTableHeadingsEnum).map(
              (heading, index) =>
                heading === InequalitiesSexTableHeadingsEnum.PERIOD ? (
                  <StyledAlignLeftHeader key={heading + index}>
                    {heading}
                  </StyledAlignLeftHeader>
                ) : (
                  <StyledAlignRightHeader key={heading + index}>
                    {heading}
                  </StyledAlignRightHeader>
                )
            )}
          </Table.Row>
        </>
      }
    >
      {healthIndicatorData.healthData.map((healthData, index) => (
        <Table.Row key={healthData.year + index}>
          <StyledTableCell>{healthData.year}</StyledTableCell>
          <StyledAlignRightCell></StyledAlignRightCell>
          <StyledAlignRightCell></StyledAlignRightCell>
          <StyledAlignRightCell></StyledAlignRightCell>
          <StyledAlignRightCell></StyledAlignRightCell>
        </Table.Row>
      ))}
    </Table>
  );
}
