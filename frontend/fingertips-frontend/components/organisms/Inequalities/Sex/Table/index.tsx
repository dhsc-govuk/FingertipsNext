import { Table } from 'govuk-react';
import { InequalitiesSexTableHeadingsEnum } from '@/components/organisms/Inequalities/inequalitiesHelper';
import styled from 'styled-components';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

interface InequalitiesSexTableProps {
  healthIndicatorData: HealthDataForArea;
}

const StyledAlignLeftHeader = styled(Table.CellHeader)({
  textAlign: 'left',
});

const StyledAlignRightHeader = styled(Table.CellHeader)({
  textAlign: 'right',
});

export function InequalitiesSexTable({
  healthIndicatorData,
}: Readonly<InequalitiesSexTableProps>) {
  return (
    <Table
      head={
        <>
          <Table.Row>{healthIndicatorData.areaName}</Table.Row>
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
