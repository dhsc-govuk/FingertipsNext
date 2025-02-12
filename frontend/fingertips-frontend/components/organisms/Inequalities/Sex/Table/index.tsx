import { Table } from 'govuk-react';
import { InequalitiesSexTableHeadingsEnum } from '@/components/organisms/Inequalities/inequalitiesHelper';
import styled from 'styled-components';

const StyledAlignLeftHeader = styled(Table.CellHeader)({
  textAlign: 'left',
});

const StyledAlignRightHeader = styled(Table.CellHeader)({
  textAlign: 'right',
});

export function InequalitiesSexTable() {
  return (
    <Table
      head={
        <>
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
    ></Table>
  );
}
