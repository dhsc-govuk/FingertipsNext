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
import { typography } from '@govuk-react/lib';
import { GovukColours, TagColours } from '@/lib/styleHelpers/colours';

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
  backgroundColor: TagColours.GreyBackground,
  minHeight: '100%',
  padding: '1.5em 1em',
});

const FocusAnchor = styled('button')(
  typography.font({ size: 16, lineHeight: '1' }),
  {
    'cursor': 'pointer',
    'textDecoration': 'underline',
    'border': 'none',
    'backgroundColor': 'transparent',
    '&:focus-visible': {
      outline: `3px solid ${GovukColours.Yellow}`,
      outlineOffset: -1,
      background: `${GovukColours.Yellow}`,
    },
  }
);

function HideFiltersSpan({ hideFilters }: { hideFilters: () => void }) {
  return (
    <FocusAnchor
      data-testid='area-filter-pane-hidefilters'
      tabIndex={0}
      onClick={(event) => {
        event.preventDefault();
        hideFilters();
      }}
    >
      Hide filter
    </FocusAnchor>
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
        {hideFilters ? <HideFiltersButton hideFilters={hideFilters} /> : null}
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
