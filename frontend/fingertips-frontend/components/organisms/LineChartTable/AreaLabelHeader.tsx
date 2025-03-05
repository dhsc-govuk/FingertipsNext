'use client';
import React from 'react';
import { AreaDocumentWithoutType } from '@/lib/search/searchTypes';
import { Table } from 'govuk-react';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {StyledTableCellHeader, StyledAlignLeftHeader, StyledAlignRightHeader} from "./SharedStyleComponents"


const StyledAreaNameHeader = styled(StyledAlignLeftHeader)({
  width: '10%',
  padding: '1em 0',
  textAlign: 'center',
});

const StyledGroupNameHeader = styled(StyledAreaNameHeader)({
  background: GovukColours.LightGrey,
});



const StyledGreyHeader = styled(StyledAlignRightHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: `solid #F3F2F1 2px`,
  width: '16%',
});

interface AreaLabelHeaderProps {
  healthData: AreaDocumentWithoutType[];
  parentData?: AreaDocumentWithoutType;
}

export const AreaLabelHeader = ({
  healthData,
  parentData,
}: AreaLabelHeaderProps) => {
  return (
    <Table.Row>
      {healthData.map((area, index) => (
        <React.Fragment key={area.areaName}>
          {index === 0 ? <Table.CellHeader /> : null}
          <StyledAreaNameHeader colSpan={5}>
            {area.areaName}
          </StyledAreaNameHeader>
        </React.Fragment>
      ))}
      {parentData ? (
        <StyledGroupNameHeader data-testid="group-header">
          Group: {parentData.areaName}
        </StyledGroupNameHeader>
      ) : null}

      <StyledGreyHeader data-testid="england-header">
        Benchmark: <br /> England
      </StyledGreyHeader>
    </Table.Row>
  );
};
