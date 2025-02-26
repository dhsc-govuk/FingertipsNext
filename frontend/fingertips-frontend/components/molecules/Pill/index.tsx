'use client';

import { Paragraph } from 'govuk-react';
import { typography } from '@govuk-react/lib';
import React from 'react';
import styled from 'styled-components';
import { RemoveIcon } from '@/components/atoms/RemoveIcon';



interface PillProps {
  children: React.ReactNode | undefined;
  selectedFilterId: string;
  removeFilter: (filterId: string) => void;
}

const StyledDivContainer = styled('div')({ 
  backgroundColor: 'white',
  border: '1px #D1D2D3 solid',
  borderRadius: '5px',
  padding: '0.3125em 0.3125em',
  maxWidth: '100%',
  margin: '0.3125em 0',
  display: 'flex',
});

const StyledFilterNameDiv = styled('div')({
  wordWrap: 'break-word',
  paddingLeft: '0.5em',
});

const StyledIconDiv = styled('div')({
  alignItems: 'center',
  display: 'flex',
});

const StyledParagraph = styled(Paragraph)(
  {
    marginBottom: '0',
  },
  typography.font({ size: 16 })
);



export function Pill({
  children,
  selectedFilterId,
  removeFilter,
}: Readonly<PillProps>) {
  return (
    <StyledDivContainer data-testid="pill-container">
      <StyledIconDiv
        data-testid="remove-icon-div"
        onClick={() => removeFilter(selectedFilterId)}
      >
      <RemoveIcon width="12" height="12" color="#000000" />
      </StyledIconDiv>
      <StyledFilterNameDiv data-testid="filter-name">
        <StyledParagraph>{children}</StyledParagraph>
      </StyledFilterNameDiv>
    </StyledDivContainer>
  );
}
