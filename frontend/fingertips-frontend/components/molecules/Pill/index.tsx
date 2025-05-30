'use client';

import React from 'react';
import styled from 'styled-components';
import { RemoveIcon } from '@/components/atoms/RemoveIcon';
import { typography } from '@govuk-react/lib';
import { FOCUSABLE } from '@govuk-react/constants';

const PillContainer = styled('div')<{ isFullWidth: boolean }>(
  ({ isFullWidth }) => ({
    backgroundColor: 'white',
    border: '1px #D1D2D3 solid',
    borderRadius: '5px',
    padding: '0.5em 0.3125em 0.5em 0.3125em',
    maxWidth: isFullWidth ? '100%' : 'max-content',
    margin: '0.3125em 0',
    display: 'flex',
  })
);

const StyledFilterChildren = styled('div')(
  {
    wordWrap: 'break-word',
    padding: '0em 1em 0em 0.75em',
    fontSize: 16,
    marginBottom: '0',
  },
  typography.common()
);

const RemoveAreaButton = styled('button')({
  ...FOCUSABLE,
  alignItems: 'center',
  backgroundColor: 'white',
  border: '0',
  cursor: 'pointer',
  display: 'flex',
  padding: '5px',
});

export interface PillProps {
  children: React.ReactNode;
  selectedFilterId?: string;
  removeFilter?: (filterId: string) => void;
  isFullWidth?: boolean;
  ariaLabelPostfix?: string;
}

export function Pill({
  children,
  selectedFilterId,
  removeFilter,
  isFullWidth = true,
  ariaLabelPostfix = '',
}: Readonly<PillProps>) {
  return (
    <PillContainer data-testid="pill-container" isFullWidth={isFullWidth}>
      {removeFilter ? (
        <RemoveAreaButton
          aria-label={`Remove area ${ariaLabelPostfix}`}
          data-testid="remove-icon-div"
          onClick={(e) => {
            e.preventDefault();
            removeFilter(selectedFilterId ?? '');
          }}
        >
          <RemoveIcon width="16" height="16" color="#000000" />
        </RemoveAreaButton>
      ) : null}
      <StyledFilterChildren data-testid="filter-name">
        {children}
      </StyledFilterChildren>
    </PillContainer>
  );
}
