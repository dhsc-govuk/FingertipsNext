import { Paragraph } from 'govuk-react';
import styled from 'styled-components';

interface SelectedFilterTagProps {
  selectedFilterName: string;
}

const StyledFilterTagDiv = styled('div')({
  backgroundColor: 'white',
  border: '1px black solid',
  display: 'flex',
});

const StyledFilterLabelDiv = styled('div')({
  justifyContent: 'flex-start',
});

const StyledFilterIconDiv = styled('div')({
  marginLeft: 'auto',
});

export function SelectedFilterTag({
  selectedFilterName,
}: Readonly<SelectedFilterTagProps>) {
  return (
    <StyledFilterTagDiv>
      <StyledFilterLabelDiv>
        <Paragraph>{selectedFilterName}</Paragraph>
      </StyledFilterLabelDiv>
      <StyledFilterIconDiv>
        <Paragraph>**x**</Paragraph>
      </StyledFilterIconDiv>
    </StyledFilterTagDiv>
  );
}
