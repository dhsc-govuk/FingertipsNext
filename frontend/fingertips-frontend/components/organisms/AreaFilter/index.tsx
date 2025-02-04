import {
  Area,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';
import { Pill } from '@/components/molecules/Pill';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';

import {
  Checkbox,
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
  availableAreas?: Area[];
  selectedGroupType?: string;
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

type AllowedParamsForHandleSelect =
  | SearchParams.AreaTypeSelected
  | SearchParams.GroupTypeSelected;

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
  availableAreas,
  selectedGroupType,
}: Readonly<AreaFilterProps>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const existingParams = new URLSearchParams(searchParams);

  const areaTypeSelected = (
    searchParamKey: AllowedParamsForHandleSelect,
    valueSelected: string
  ) => {
    const searchStateManager =
      SearchStateManager.setStateFromParams(existingParams);

    searchStateManager.addParamValueToState(searchParamKey, valueSelected);
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const availableGroupTypes = determineApplicableGroupTypes(
    availableAreaTypes,
    selectedAreaType
  );

  const removeSelectedArea = (areaCode: string) => {
    const searchStateManager =
      SearchStateManager.setStateFromParams(existingParams);

    searchStateManager.removeParamValueFromState(
      SearchParams.AreasSelected,
      areaCode
    );
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

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
          {selectedAreas
            ? selectedAreas.map((selectedArea) => (
                <Pill
                  key={selectedArea.code}
                  selectedFilterName={selectedArea.name}
                  selectedFilterId={selectedArea.code}
                  removeFilter={removeSelectedArea}
                />
              ))
            : null}
        </StyledFilterSelectedAreaDiv>

        <ShowHideContainer summary="Add or change areas">
          <StyledFilterSelect
            label="Select an area type"
            input={{
              onChange: (e) =>
                areaTypeSelected(SearchParams.AreaTypeSelected, e.target.value),
              defaultValue: selectedAreaType,
              disabled: selectedAreas && selectedAreas.length > 0,
            }}
          >
            {availableAreaTypes?.map((areaType) => (
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
            <StyledFilterSelect
              label="1. Select a group type"
              input={{
                onChange: (e) =>
                  areaTypeSelected(
                    SearchParams.GroupTypeSelected,
                    e.target.value
                  ),
                defaultValue: selectedGroupType,
                disabled: selectedAreas && selectedAreas?.length > 0,
              }}
            >
              {availableGroupTypes?.map((areaType) => (
                <option key={areaType.name} value={areaType.name}>
                  {areaType.name}
                </option>
              ))}
            </StyledFilterSelect>
          </ShowHideContainer>

          <>
            {availableAreas?.map((area) => (
              <Checkbox key={area.code} value={area.code} sizeVariant="SMALL">
                {area.name}
              </Checkbox>
            ))}
          </>
        </ShowHideContainer>
      </StyledFilterDiv>
    </StyledFilterPane>
  );
}
