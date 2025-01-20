'use client';

import { Paragraph } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import React from 'react';
import styled from 'styled-components';
import { RemoveIcon } from '@/components/atoms/RemoveIcon';

interface PillProps {
  selectedFilterName: string;
}

const StyledDivContainer = styled('div')({
  backgroundColor: 'white',
  border: '0.1em black solid',
  padding: '0.3125em 0.3125em',
  maxWidth: '100%',
  margin: '0.3125em',
  display: 'flex',
});

const StyledFilterNameDiv = styled('div')({
  maxWidth: '80%',
  wordWrap: 'break-word',
});

const StyledIconDiv = styled('div')({
  marginLeft: 'auto',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

const StyledParagraph = styled(Paragraph)(
  {
    marginBottom: '0',
  },
  typography.font({ size: 16 })
);

export function Pill({ selectedFilterName }: Readonly<PillProps>) {
  return (
    <StyledDivContainer data-testid="pill-container">
      <StyledFilterNameDiv data-testid="filter-name">
        <StyledParagraph>{selectedFilterName}</StyledParagraph>
      </StyledFilterNameDiv>
      <StyledIconDiv data-testid="remove-icon-div">
        <RemoveIcon width="20" height="20" color="#000000" />
      </StyledIconDiv>
    </StyledDivContainer>
  );
}
