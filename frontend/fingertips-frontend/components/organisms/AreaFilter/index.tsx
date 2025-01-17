import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { H3, LabelText, Paragraph, SectionBreak, Select } from 'govuk-react';
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

      <div>
        <LabelText>Areas Selected</LabelText>
        {selectedAreas && selectedAreas.length > 0 ? (
          selectedAreas?.map((selectedArea) => (
            <Paragraph key={selectedArea.code}>{selectedArea.name}</Paragraph>
          ))
        ) : (
          <Paragraph>There are no areas selected</Paragraph>
        )}
      </div>

      <div>
        <LabelText>Filter by area</LabelText>
        {!selectedAreas || selectedAreas.length === 0 ? (
          <StyledFilterSelect label="Select an area type">
            {availableAreaTypes?.map((areaType) => (
              <option key={areaType} value={areaType}>
                {areaType}
              </option>
            ))}
          </StyledFilterSelect>
        ) : null}
      </div>
    </StyledFilterDiv>
  );
}
