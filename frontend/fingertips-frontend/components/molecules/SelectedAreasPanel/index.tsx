import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Pill } from '../Pill';
import { LabelText, Paragraph } from 'govuk-react';
import { typography } from '@govuk-react/lib';

interface SelectedAreasPanelProps {
  selectedAreasData?: AreaWithRelations[];
  searchState?: SearchStateParams;
}

const StyledFilterSelectedAreaDiv = styled('div')({
  paddingBottom: '1.5em',
});

const StyledParagraph = styled(Paragraph)(
  {
    marginBottom: '0',
  },
  typography.font({ size: 16 })
);

const StyledFilterLabel = styled(LabelText)({
  fontWeight: 'bold',
});

export function SelectedAreasPanel({
  selectedAreasData,
  searchState,
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
            <Pill
              key={selectedArea.code}
              selectedFilterId={selectedArea.code}
              removeFilter={removeSelectedArea}
            >
              <StyledParagraph>{selectedArea.name}</StyledParagraph>
            </Pill>
          ))
        : null}
    </StyledFilterSelectedAreaDiv>
  );
}
