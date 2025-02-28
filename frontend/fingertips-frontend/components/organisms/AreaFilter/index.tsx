import {
  Area,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';
import { SearchStateParams } from '@/lib/searchStateManager';
import { H3, SectionBreak } from 'govuk-react';
import styled from 'styled-components';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';
import { SelectedAreasPanel } from '@/components/molecules/SelectedAreasPanel';
import { SelectAreasFilterPanel } from '@/components/molecules/SelectAreasFilterPanel';

interface AreaFilterProps {
  selectedAreasData?: AreaWithRelations[];
  availableAreaTypes?: AreaType[];
  availableGroupTypes?: AreaType[];
  availableGroups?: Area[];
  availableAreas?: Area[];
  searchState?: SearchStateParams;
}

const StyledFilterPane = styled('div')({});

const StyledFilterPaneHeader = styled('div')({
  backgroundColor: '#D1D2D3',
  display: 'flex',
  marginBottom: '-1.3em',
  padding: '0.5em 1em',
});

const StyledFilterDiv = styled('div')({
  backgroundColor: '#E1E2E3',
  minHeight: '100%',
  padding: '1.5em 1em',
});

export function AreaFilter({
  selectedAreasData,
  availableAreaTypes,
  availableGroupTypes,
  availableGroups,
  availableAreas,
  searchState,
}: Readonly<AreaFilterProps>) {
  return (
    <StyledFilterPane data-testid="area-filter-container">
      <StyledFilterPaneHeader>
        <H3>Filters</H3>
      </StyledFilterPaneHeader>
      <SectionBreak visible={true} />
      <StyledFilterDiv>
        <SelectedAreasPanel
          selectedAreasData={selectedAreasData}
          searchState={searchState}
        />

        <ShowHideContainer summary="Add or change areas">
          <SelectAreasFilterPanel
            selectedAreasData={selectedAreasData}
            availableAreaTypes={availableAreaTypes}
            availableGroupTypes={availableGroupTypes}
            availableGroups={availableGroups}
            availableAreas={availableAreas}
            searchState={searchState}
          />
        </ShowHideContainer>
      </StyledFilterDiv>
    </StyledFilterPane>
  );
}
