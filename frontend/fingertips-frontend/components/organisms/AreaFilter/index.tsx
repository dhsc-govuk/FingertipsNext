import { Pill } from '@/components/molecules/Pill';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { SearchStateManager } from '@/lib/searchStateManager';
import { H3, LabelText, Paragraph, SectionBreak, Select } from 'govuk-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const existingParams = new URLSearchParams(searchParams);
  const searchStateManager =
    SearchStateManager.setStateFromParams(existingParams);
  const searchState = searchStateManager.getSearchState();

  const handleAreaTypeSelect = (areaTypeSelected: string) => {
    searchStateManager.setAreaTypeSelected(areaTypeSelected);
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  return (
    <StyledFilterDiv data-testid="area-filter-container">
      <H3>Filters</H3>
      <SectionBreak visible={true} />

      <div>
        <LabelText>Areas Selected</LabelText>
        {selectedAreas && selectedAreas.length > 0 ? (
          selectedAreas?.map((selectedArea) => (
            <Pill
              key={selectedArea.code}
              selectedFilterName={selectedArea.name}
            />
          ))
        ) : (
          <Paragraph>There are no areas selected</Paragraph>
        )}
      </div>

      <div>
        <LabelText>Filter by area</LabelText>
        {!selectedAreas || selectedAreas.length === 0 ? (
          <StyledFilterSelect
            label="Select an area type"
            input={{
              onChange: (e) => handleAreaTypeSelect(e.target.value),
              defaultValue: searchState.areaTypeSelected,
            }}
          >
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
