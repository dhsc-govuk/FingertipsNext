import { Paragraph } from 'govuk-react';
import styled from 'styled-components';

interface SelectedFilterTagProps {
  selectedFilterName: string;
}

const StyledFilterTagDiv = styled('div')({
  backgroundColor: 'white',
  border: '2px black solid',
  display: 'flex',
  padding: '0.25em',
});

const StyledFilterLabelDiv = styled('div')({
  justifyContent: 'flex-start',
});

const StyledFilterIconDiv = styled('div')({
  marginLeft: 'auto',
});

const StyledParagragh = styled(Paragraph)({
  marginBottom: '0em',
});

export function SelectedFilterTag({
  selectedFilterName,
}: Readonly<SelectedFilterTagProps>) {
  return (
    <StyledFilterTagDiv>
      <StyledFilterLabelDiv>
        <StyledParagragh>{selectedFilterName}</StyledParagragh>
      </StyledFilterLabelDiv>
      <StyledFilterIconDiv>
        <Paragraph>**x**</Paragraph>
      </StyledFilterIconDiv>
    </StyledFilterTagDiv>
  );
}
