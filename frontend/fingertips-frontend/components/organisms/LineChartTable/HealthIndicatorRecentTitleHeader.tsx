'use client';

import React from 'react';
import styled from 'styled-components';
import { Table } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { AreaDocument } from '@/lib/search/searchTypes';

const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 14 }),
  {
    fontWeight: 'bold',
    padding: '0.625em 0',
  }
);

const StyledAlignLeftHeader = styled(StyledTableCellHeader)({
  textAlign: 'left',
  verticalAlign: 'top',
});

const StyledTitleRow = styled(StyledAlignLeftHeader)({
  border: 'none',
});

export type HealthIndicatorTitleHeaderData = Omit<AreaDocument, 'areaType'>;

interface HealthIndicatorTitleHeaderProps {
  healthAreas: HealthIndicatorTitleHeaderData[];
}

export const HealthIndicatorRecentTitleHeader = ({
  healthAreas,
}: HealthIndicatorTitleHeaderProps) => {
  return (
    <Table.Row>
      {healthAreas.map(
        (area: HealthIndicatorTitleHeaderData, index: number) => (
          <React.Fragment key={area.areaName + index}>
            {index === 0 && healthAreas.length > 1 && (
              <StyledTitleRow></StyledTitleRow>
            )}
            <StyledTitleRow colSpan={5}>
              {`${area.areaName} recent trend:`}
            </StyledTitleRow>
          </React.Fragment>
        )
      )}
    </Table.Row>
  );
};
