import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { SearchStateParams } from '@/lib/searchStateManager';
import { H3, SectionBreak } from 'govuk-react';
import styled from 'styled-components';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';
import { SelectedAreasPanel } from '@/components/molecules/SelectedAreasPanel';
import {
  AreaFilterData,
  SelectAreasFilterPanel,
} from '@/components/molecules/SelectAreasFilterPanel';
import { SelectedIndicatorsPanel } from '@/components/molecules/SelectedIndicatorsPanel';
import { IndicatorDocument } from '@/lib/search/searchTypes';

interface AreaFilterPaneProps {
  selectedAreasData?: AreaWithRelations[];
  selectedIndicatorsData?: IndicatorDocument[];
  areaFilterData?: AreaFilterData;
  searchState?: SearchStateParams;
  hideFilters?: () => void;
}

const StyledFilterPane = styled('div')({});

const StyledFilterPaneHeader = styled('div')({
  backgroundColor: '#D1D2D3',
  display: 'flex',
  padding: '0.5em 1em',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const StyledFilterDiv = styled('div')({
  backgroundColor: '#E1E2E3',
  minHeight: '100%',
  padding: '1.5em 1em',
});

const FocusSpan = styled('span')`
  {
    cursor: pointer;
    text-decoration: underline;
    &:focus-visible {
      outline: 4px solid yellow;
      outlineoffset: -1;
      background: yellow;
  }
`;

function HideFiltersSpan({ hideFilters }: { hideFilters: () => void }) {
  return (
    <FocusSpan tabIndex={0} onClick={hideFilters}>
      Hide filter
    </FocusSpan>
  );
}

const HideFiltersButton = styled(HideFiltersSpan)`
  float: right;
`;

export function AreaFilterPane({
  selectedAreasData,
  selectedIndicatorsData,
  areaFilterData,
  searchState,
  hideFilters,
}: Readonly<AreaFilterPaneProps>) {
  return (
    <StyledFilterPane data-testid="area-filter-container">
      <StyledFilterPaneHeader>
        <H3 style={{ marginBottom: 0 }}>Filters</H3>
        { hideFilters ? (<HideFiltersButton hideFilters={hideFilters} />) : null }
      </StyledFilterPaneHeader>
      <SectionBreak visible={true} />
      <StyledFilterDiv>
        {selectedIndicatorsData ? (
          <SelectedIndicatorsPanel
            selectedIndicatorsData={selectedIndicatorsData}
            searchState={searchState}
          />
        ) : null}

        <SelectedAreasPanel
          selectedAreasData={selectedAreasData}
          areaFilterData={areaFilterData}
          searchState={searchState}
        />

        <ShowHideContainer summary="Add or change areas">
          <SelectAreasFilterPanel
            areaFilterData={areaFilterData}
            searchState={searchState}
          />
        </ShowHideContainer>
      </StyledFilterDiv>
    </StyledFilterPane>
  );
}
