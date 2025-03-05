'use client';

import React from 'react';
import styled from 'styled-components';
import { Table } from 'govuk-react';
import { AreaDocumentWithoutType } from '@/lib/search/searchTypes';
import { StyledAlignLeftHeader } from './SharedStyleComponents';

const StyledTitleRow = styled(StyledAlignLeftHeader)({
  border: 'none',
});

interface HealthIndicatorTitleHeaderProps {
  healthAreas: AreaDocumentWithoutType[];
}

export const HealthIndicatorRecentTitleHeader = ({
  healthAreas,
}: HealthIndicatorTitleHeaderProps) => {
  return (
    <Table.Row>
      {healthAreas.map((area: AreaDocumentWithoutType, index: number) => (
        <React.Fragment key={area.areaName + index}>
          {index === 0 && healthAreas.length > 1 && (
            <StyledTitleRow></StyledTitleRow>
          )}
          <StyledTitleRow colSpan={5}>
            {`${area.areaName} recent trend:`}
          </StyledTitleRow>
        </React.Fragment>
      ))}
    </Table.Row>
  );
};
