'use client';

import React from 'react';
import styled from 'styled-components';
import { RemoveIcon } from '@/components/atoms/RemoveIcon';

const StyledDivContainer = styled('div')({
  backgroundColor: 'white',
  border: '1px #D1D2D3 solid',
  borderRadius: '5px',
  padding: '0.3125em 0.3125em',
  maxWidth: '100%',
  margin: '0.3125em 0',
  display: 'flex',
});

const StyledFilterChildren = styled('div')({
  wordWrap: 'break-word',
  paddingLeft: '0.5em',
  fontSize: 16,
  marginBottom: '0',
});

const StyledIconDiv = styled('div')({
  alignItems: 'center',
  display: 'flex',
});

interface PillProps {
  children: React.ReactNode;
  selectedFilterId?: string;
  removeFilter: (filterId: string) => void;
}

export function Pill({
  children,
  selectedFilterId,
  removeFilter,
}: Readonly<PillProps>) {
  return (
    <StyledDivContainer data-testid="pill-container">
      <StyledIconDiv
        data-testid="remove-icon-div"
        onClick={(e) => {
          e.preventDefault();
          removeFilter(selectedFilterId ?? '');
        }}
      >
        <RemoveIcon width="12" height="12" color="#000000" />
      </StyledIconDiv>
      <StyledFilterChildren data-testid="filter-name">
        {children}
      </StyledFilterChildren>
    </StyledDivContainer>
  );
}
