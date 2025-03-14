'use client';

import React from 'react';
import styled from 'styled-components';
import { RemoveIcon } from '@/components/atoms/RemoveIcon';
import { typography } from '@govuk-react/lib';

const StyledDivContainer = styled('div')<{ isFullWidth: boolean }>(
  ({ isFullWidth }) => ({
    backgroundColor: 'white',
    border: '1px #D1D2D3 solid',
    borderRadius: '5px',
    padding: '0.5em 0.3125em',
    maxWidth: isFullWidth ? '100%' : 'max-content',
    margin: '0.3125em 0',
    display: 'flex',
  })
);

const StyledFilterChildren = styled('div')(
  {
    wordWrap: 'break-word',
    padding: '0em 1em',
    fontSize: 16,
    marginBottom: '0',
  },
  typography.common()
);

const StyledIconDiv = styled('div')({
  alignItems: 'center',
  display: 'flex',
});

interface PillProps {
  children: React.ReactNode;
  selectedFilterId?: string;
  removeFilter: (filterId: string) => void;
  isFullWidth?: boolean;
}

export function Pill({
  children,
  selectedFilterId,
  removeFilter,
  isFullWidth = true,
}: Readonly<PillProps>) {
  return (
    <StyledDivContainer data-testid="pill-container" isFullWidth={isFullWidth}>
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
