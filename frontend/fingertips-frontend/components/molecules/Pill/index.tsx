'use client';

import { Paragraph } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import React from 'react';
import styled from 'styled-components';

interface PillProps {
  selectedFilterName: string;
}

const StyledDivContainer = styled('div')({
  backgroundColor: 'white',
  border: '2px black solid',
  padding: '10px 20px',
  maxWidth: '40%',
  margin: '5px',
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

const StyledIconSvg = styled('svg')({
  cursor: 'pointer',
});

export function Pill({ selectedFilterName }: Readonly<PillProps>) {
  return (
    <StyledDivContainer data-testid="main-container">
      <StyledFilterNameDiv data-testid="filter-name">
        <StyledParagraph>{selectedFilterName}</StyledParagraph>
      </StyledFilterNameDiv>
      <StyledIconDiv data-testid="remove-icon-div">
        <StyledIconSvg
          data-testid="x-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 25 25"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </StyledIconSvg>
      </StyledIconDiv>
    </StyledDivContainer>
  );
}
