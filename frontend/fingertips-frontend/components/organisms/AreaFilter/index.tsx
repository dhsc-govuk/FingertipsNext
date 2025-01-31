import { AreaType, AreaWithRelations } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import {
  Details,
  H3,
  LabelText,
  Paragraph,
  SectionBreak,
  Select,
} from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';

interface AreaFilterProps {
  selectedAreas?: AreaWithRelations[];
  selectedAreaType?: string;
  availableAreaTypes?: AreaType[];
}

const StyledFilterPane = styled('div')({});

const StyledFilterPaneHeader = styled('div')({
  backgroundColor: '#D1D2D3',
  display: 'flex',
  marginBottom: '-1.3em',
  padding: '0.5em 1em',
});

const StyledFilterSelectedAreaDiv = styled('div')({
  paddingBottom: '1.5em',
});

const StyledFilterToggle = styled(Paragraph)(
  {
    marginLeft: 'auto',
    justifyContent: 'flex-start',
    textDecoration: 'underline',
    padding: '0em',
    alignItems: 'center',
    display: 'flex',
  },
  typography.font({ size: 16 })
);

const StyledFilterDiv = styled('div')({
  backgroundColor: '#E1E2E3',
  minHeight: '100%',
  padding: '1.5em 1em',
});

const StyledFilterLabel = styled(LabelText)({
  fontWeight: 'bold',
  padding: '0em',
  div: {
    div: {
      padding: '0em',
    },
  },
});

const StyledFilterSelect = styled(Select)({
  select: {
    width: '100%',
  },
  marginBottom: '1em',
});

const StyledFilterDetails = styled(Details)({
  div: {
    borderLeft: 'none',
    padding: '1em 0em',
  },
  summary: {
    color: '#000000',
  },
});

const determineApplicableGroupTypes = (
  sortedAreaTypes?: AreaType[],
  selectedAreaType?: string
): AreaType[] | undefined => {
  if (sortedAreaTypes && selectedAreaType) {
    const selectedAreaTypeData = sortedAreaTypes.find(
      (areaType) => areaType.name === selectedAreaType
    );

    if (selectedAreaTypeData) {
      return sortedAreaTypes.filter(
        (areaType) => areaType.level <= selectedAreaTypeData?.level
      );
    }
  }
};

export function AreaFilter({
  selectedAreas,
  selectedAreaType,
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
    searchStateManager.addParamValueToState(
      SearchParams.AreaTypeSelected,
      areaTypeSelected
    );
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const sortedByLevelAreaTypes = availableAreaTypes?.sort(
    (a, b) => a.level - b.level
  );

  const availableGroupTypes = determineApplicableGroupTypes(
    sortedByLevelAreaTypes,
    selectedAreaType
  );

  return (
    <StyledFilterPane data-testid="area-filter-container">
      <StyledFilterPaneHeader>
        <H3>Filters</H3>
        <StyledFilterToggle>Hide filters</StyledFilterToggle>
      </StyledFilterPaneHeader>
      <SectionBreak visible={true} />
      <StyledFilterDiv>
        <StyledFilterSelectedAreaDiv>
          <StyledFilterLabel>
            {`Selected areas (${selectedAreas?.length ?? 0})`}
          </StyledFilterLabel>
        </StyledFilterSelectedAreaDiv>

        <ShowHideContainer summary="Add or change areas">
          <StyledFilterSelect
            label="Select an area type"
            input={{
              onChange: (e) => handleAreaTypeSelect(e.target.value),
              defaultValue: searchState[SearchParams.AreaTypeSelected],
              disabled: selectedAreas && selectedAreas.length > 0,
            }}
          >
            {sortedByLevelAreaTypes?.map((areaType) => (
              <option key={areaType.name} value={areaType.name}>
                {areaType.name}
              </option>
            ))}
          </StyledFilterSelect>

          <StyledFilterLabel>Area List</StyledFilterLabel>
          <Paragraph>Select one or more areas to compare</Paragraph>

          <ShowHideContainer
            summary="Refine the area list"
            showSideBarWhenOpen={true}
          >
            <StyledFilterSelect label="1. Select a group type">
              {availableGroupTypes?.map((areaType) => (
                <option key={areaType.name} value={areaType.name}>
                  {areaType.name}
                </option>
              ))}
            </StyledFilterSelect>
          </ShowHideContainer>
        </ShowHideContainer>
      </StyledFilterDiv>
    </StyledFilterPane>
  );
}
