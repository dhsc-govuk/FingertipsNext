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
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';

interface SelectedAreasPanelProps {
  selectedAreasData?: AreaWithRelations[];
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

  return (
    <StyledFilterSelectedAreaDiv>
      <StyledFilterLabel>
        {`Selected areas (${selectedAreasData?.length ?? 0})`}
      </StyledFilterLabel>
      {selectedAreasData
        ? selectedAreasData.map((selectedArea) => (
            <AreaSelectedPill
              key={selectedArea.code}
              areaName={selectedArea.name}
              areaCode={selectedArea.code}
              areaTypeKey={selectedArea.areaType.key as AreaTypeKeys}
              areaTypeName={selectedArea.areaType.name}
              onRemoveFilter={removeSelectedArea}
              inFilterPane={inFilterPane}
            />
          ))
        : null}
    </StyledFilterSelectedAreaDiv>
  );
}
