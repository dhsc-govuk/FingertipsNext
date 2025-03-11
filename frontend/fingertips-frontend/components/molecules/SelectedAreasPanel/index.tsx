import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { LabelText } from 'govuk-react';
import { AreaSelectedPill } from '../AreaSelectedPill';
import { GroupAreaSelectedPill } from '../GroupAreaSelectedPill';
import { allAreaTypes } from '@/lib/areaFilterHelpers/areaType';
import { AreaFilterData } from '../SelectAreasFilterPanel';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

interface SelectedAreasPanelProps {
  selectedAreasData?: AreaWithRelations[];
  areaFilterData?: AreaFilterData;
  searchState?: SearchStateParams;
  inFilterPane?: boolean;
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
  searchState,
  inFilterPane,
}: Readonly<SelectedAreasPanelProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const removeSelectedArea = (areaCode: string) => {
    searchStateManager.removeParamValueFromState(
      SearchParams.AreasSelected,
      areaCode
    );
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const removeSelectedGroup = () => {
    searchStateManager.removeParamValueFromState(
      SearchParams.GroupAreaSelected
    );
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const areaType = allAreaTypes.find(
    (areaType) => areaType.key === searchState?.[SearchParams.AreaTypeSelected]
  );

  const selectedGroupData = areaFilterData?.availableGroups?.find(
    (group) => group.code === searchState?.[SearchParams.GroupSelected]
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
            inFilterPane={inFilterPane}
          />
        </div>
      ) : (
        <div data-testid="standard-selected-areas-panel">
          <StyledFilterLabel>
            {`Selected areas (${selectedAreasData?.length ?? 0})`}
          </StyledFilterLabel>
          {selectedAreasData
            ? selectedAreasData.map((selectedArea) => (
                <AreaSelectedPill
                  key={selectedArea.code}
                  area={selectedArea}
                  onRemoveFilter={removeSelectedArea}
                  inFilterPane={inFilterPane}
                />
              ))
            : null}
        </div>
      )}
    </StyledFilterSelectedAreaDiv>
  );
}
