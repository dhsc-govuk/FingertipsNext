import { Area } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { LabelText } from 'govuk-react';
import { AreaSelectedPill } from '../AreaSelectedPill';
import { GroupAreaSelectedPill } from '../GroupAreaSelectedPill';
import { allAreaTypes } from '@/lib/areaFilterHelpers/areaType';
import { AreaFilterData } from '../SelectAreasFilterPanel';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';
import React from 'react';
import { useMoreRowsWhenScrolling } from '@/components/hooks/useMoreRowsWhenScrolling';

interface SelectedAreasPanelProps {
  selectedAreasData?: Area[];
  areaFilterData?: AreaFilterData;
  isFullWidth?: boolean;
}

const StyledFilterSelectedAreaDiv = styled('div')({
  paddingBottom: '1.5em',
});

const StyledFilterLabel = styled(LabelText)({
  fontWeight: 'bold',
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

    searchStateManager.removeParamValueFromState(
      SearchParams.AreasSelected,
      areaCode
    );

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const removeSelectedGroup = () => {
    setIsLoading(true);

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

  const { triggerRef, rowsToShow, hasMore } =
    useMoreRowsWhenScrolling<AreaWithRelations>(selectedAreasData ?? [], 10);

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
          {selectedAreasData
            ? rowsToShow.map((selectedArea) => (
                <AreaSelectedPill
                  key={selectedArea.code}
                  area={selectedArea}
                  onRemoveFilter={removeSelectedArea}
                  isFullWidth={isFullWidth}
                />
              ))
            : null}
          <div ref={triggerRef}>{hasMore ? 'Loading...' : null}</div>
        </div>
      )}
    </StyledFilterSelectedAreaDiv>
  );
}
