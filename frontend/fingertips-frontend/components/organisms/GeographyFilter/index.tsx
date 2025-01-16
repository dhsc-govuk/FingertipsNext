/* eslint-disable @typescript-eslint/no-explicit-any */

import { H3, LabelText, SectionBreak, Select } from 'govuk-react';
import styled from 'styled-components';

interface GeographyFilterProps {
  selectedAreas?: any[];
  availableAreaTypes?: any[];
}

const StyledFilterDiv = styled('div')({
  backgroundColor: '#E1E2E3',
  minHeight: '100%',
  padding: '0.5em',
});

const StyledFilterSelect = styled(Select)({
  width: '500px',
});

export function GeographyFilter({
  selectedAreas,
  availableAreaTypes,
}: Readonly<GeographyFilterProps>) {
  return (
    <StyledFilterDiv data-testid="geography-filter-container">
      <H3>Filters</H3>
      <SectionBreak visible={true} />

      {selectedAreas && selectedAreas.length > 0 ? (
        <div>
          <LabelText>Areas Selected</LabelText>
          {selectedAreas?.map((selectedArea) => (
            <p key={selectedArea.id}>{selectedArea.name}</p>
          ))}
        </div>
      ) : (
        <StyledFilterSelect label="Select an area type">
          {availableAreaTypes?.map((areaType) => (
            <option key={areaType.id} value={areaType.id}>
              {areaType.name}
            </option>
          ))}
        </StyledFilterSelect>
      )}
    </StyledFilterDiv>
  );
}
