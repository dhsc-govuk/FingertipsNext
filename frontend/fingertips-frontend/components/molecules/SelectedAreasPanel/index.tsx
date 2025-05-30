import { Area } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { LabelText, Paragraph } from 'govuk-react';
import { AreaSelectedPill } from '../AreaSelectedPill';
import { GroupAreaSelectedPill } from '../GroupAreaSelectedPill';
import { allAreaTypes } from '@/lib/areaFilterHelpers/areaType';
import { AreaFilterData } from '../SelectAreasFilterPanel';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';
import React from 'react';
import { useMoreRowsWhenScrolling } from '@/components/hooks/useMoreRowsWhenScrolling';
import { InViewTrigger } from '@/components/hooks/InViewTrigger';

interface SelectedAreasPanelProps {
  selectedAreasData?: Area[];
  areaFilterData?: AreaFilterData;
  isFullWidth?: boolean;
}

const StyledFilterSelectedAreaDiv = styled('div')({
  paddingBottom: '1em',
});

const StyledFilterLabel = styled(LabelText)({
  fontWeight: 'bold',
});

const StyledDefaultToEngland = styled(Paragraph)({
  marginTop: '0.5em',
});

export function SelectedAreasPanel({
  selectedAreasData,
  areaFilterData,
  isFullWidth,
}: Readonly<SelectedAreasPanelProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const removeSelectedArea = (areaCode: string) => {
    setIsLoading(true);

    searchStateManager.clearChartState();
    searchStateManager.removeParamValueFromState(
      SearchParams.AreasSelected,
      areaCode
    );

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const removeSelectedGroup = () => {
    setIsLoading(true);

    searchStateManager.clearChartState();
    searchStateManager.removeParamValueFromState(
      SearchParams.GroupAreaSelected
    );
    searchStateManager.removeAllParamFromState(SearchParams.AreasSelected);

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const areaType = allAreaTypes.find(
    (areaType) => areaType.key === searchState?.[SearchParams.AreaTypeSelected]
  );

  const selectedGroupData = areaFilterData?.availableGroups?.find(
    (group) => group.code === searchState?.[SearchParams.GroupSelected]
  );

  const { triggerRef, rowsToShow, hasMore } = useMoreRowsWhenScrolling<Area>(
    selectedAreasData ?? [],
    10
  );

  return (
    <StyledFilterSelectedAreaDiv data-testid="selected-areas-panel">
      {searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED ? (
        <div data-testid="group-selected-areas-panel">
          <StyledFilterLabel>
            {`Selected areas (${areaFilterData?.availableAreas?.length})`}
          </StyledFilterLabel>
          <GroupAreaSelectedPill
            areaTypeName={areaType?.name}
            groupSelected={selectedGroupData}
            onRemoveFilter={removeSelectedGroup}
            isFullWidth={isFullWidth}
          />
        </div>
      ) : (
        <div data-testid="standard-selected-areas-panel">
          <StyledFilterLabel>
            {`Selected areas (${selectedAreasData?.length ?? 0})`}
          </StyledFilterLabel>
          {selectedAreasData && selectedAreasData?.length > 0 ? (
            rowsToShow.map((selectedArea) => (
              <AreaSelectedPill
                key={selectedArea.code}
                area={selectedArea}
                onRemoveFilter={removeSelectedArea}
                isFullWidth={isFullWidth}
              />
            ))
          ) : (
            <StyledDefaultToEngland>
              Default area England
            </StyledDefaultToEngland>
          )}
          <InViewTrigger triggerRef={triggerRef} more={hasMore} />
        </div>
      )}
    </StyledFilterSelectedAreaDiv>
  );
}
