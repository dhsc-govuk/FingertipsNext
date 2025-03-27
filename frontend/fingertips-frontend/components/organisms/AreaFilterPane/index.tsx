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
import { ClientStorage, ClientStorageKeys } from '@/storage/clientStorage';
import { useState } from 'react';

interface AreaFilterPaneProps {
  selectedAreasData?: AreaWithRelations[];
  selectedIndicatorsData?: IndicatorDocument[];
  areaFilterData?: AreaFilterData;
  searchState?: SearchStateParams;
  pageType?: 'results' | 'chart';
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

export function AreaFilterPane({
  selectedAreasData,
  selectedIndicatorsData,
  areaFilterData,
  searchState,
  pageType,
}: Readonly<AreaFilterPaneProps>) {
  const storeKey =
    pageType === 'results'
      ? ClientStorageKeys.AreaFilterResultsPage
      : ClientStorageKeys.AreaFilterChartPage;

  const [isAreaFilterOpen, setIsAreaFilterOpen] = useState<boolean>();

  // useEffect(() => {
  //   setIsAreaFilterOpen(isAreaFilterOpen);
  // }, [isAreaFilterOpen]);

  console.log(`storeKey ${storeKey}`);

  // const isAreaFilterOpen = ClientStorage.getState<boolean>(storeKey) ?? true;

  console.log(`isAreaFilterOpen ${isAreaFilterOpen}`);

  const updateIsAreaFilterOpen = () => {
    console.log(`isAreaFilterOpen will change to ${!isAreaFilterOpen}`);

    ClientStorage.updateState(storeKey, !isAreaFilterOpen);
    setIsAreaFilterOpen(!isAreaFilterOpen);
  };

  return (
    <StyledFilterPane data-testid="area-filter-container">
      <StyledFilterPaneHeader>
        <H3>Filters</H3>
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

        <ShowHideContainer
          key={`show-hide-${isAreaFilterOpen}`}
          summary="Add or change areas"
          open={isAreaFilterOpen}
          onToggleContainer={updateIsAreaFilterOpen}
        >
          <SelectAreasFilterPanel
            areaFilterData={areaFilterData}
            searchState={searchState}
          />
        </ShowHideContainer>
      </StyledFilterDiv>
    </StyledFilterPane>
  );
}
