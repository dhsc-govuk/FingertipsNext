import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { H3, LabelText, SectionBreak, Select } from 'govuk-react';
import styled from 'styled-components';

interface AreaFilterProps {
  selectedAreas?: AreaWithRelations[];
  availableAreaTypes?: string[];
}

const StyledFilterDiv = styled('div')({
  backgroundColor: '#E1E2E3',
  minHeight: '100%',
  padding: '0.5em',
});

const StyledFilterSelect = styled(Select)({
  select: {
    width: '100%',
  },
});

export function AreaFilter({
  selectedAreas,
  availableAreaTypes,
}: Readonly<AreaFilterProps>) {
  return (
    <StyledFilterDiv data-testid="geography-filter-container">
      <H3>Filters</H3>
      <SectionBreak visible={true} />

      {selectedAreas && selectedAreas.length > 0 ? (
        <div>
          <LabelText>Areas Selected</LabelText>
          {selectedAreas?.map((selectedArea) => (
            <p key={selectedArea.code}>{selectedArea.name}</p>
          ))}
        </div>
      ) : (
        <StyledFilterSelect label="Select an area type">
          {availableAreaTypes?.map((areaType) => (
            <option key={areaType} value={areaType}>
              {areaType}
            </option>
          ))}
        </StyledFilterSelect>
      )}
    </StyledFilterDiv>
  );
}
