import {
  Area,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

import {
  Checkbox,
  H3,
  LabelText,
  Paragraph,
  SectionBreak,
  Select,
} from 'govuk-react';
import { Pill } from '@/components/molecules/Pill';
import { typography } from '@govuk-react/lib';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';
import { determineApplicableGroupTypes } from '@/lib/areaFilterHelpers/determineApplicableGroupTypes';

interface AreaFilterProps {
  selectedAreasData?: AreaWithRelations[];
  availableAreaTypes?: AreaType[];
  availableAreas?: Area[];
  searchState?: SearchStateParams;
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

const isAreaSelected = (areaCode: string, selectedAreas?: Area[]): boolean =>
  selectedAreas ? selectedAreas?.some((area) => area.code === areaCode) : false;

export function AreaFilter({
  selectedAreasData,
  availableAreaTypes,
  availableAreas,
  searchState,
}: Readonly<AreaFilterProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchStateManager =
    SearchStateManager.setStateFromSearchStateParams(searchState);

  const areaTypeSelected = (
    searchParamKey: AllowedParamsForHandleSelect,
    valueSelected: string
  ) => {
    searchStateManager.addParamValueToState(searchParamKey, valueSelected);
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const handleAreaSelected = (areaCode: string, checked: boolean) => {
    if (checked) {
      searchStateManager.addParamValueToState(
        SearchParams.AreasSelected,
        areaCode
      );
    } else {
      searchStateManager.removeParamValueFromState(
        SearchParams.AreasSelected,
        areaCode
      );
    }

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const availableGroupTypesName = determineApplicableGroupTypes(
    availableAreaTypes,
    searchState?.[SearchParams.AreaTypeSelected]
  );

  const removeSelectedArea = (areaCode: string) => {
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
            {`Selected areas (${selectedAreasData?.length ?? 0})`}
          </StyledFilterLabel>
          {selectedAreasData
            ? selectedAreasData.map((selectedArea) => (
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
              defaultValue: searchState?.[SearchParams.AreaTypeSelected],
              disabled: selectedAreasData && selectedAreasData?.length > 0,
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
                defaultValue: searchState?.[SearchParams.GroupTypeSelected],
                disabled: selectedAreasData && selectedAreasData?.length > 0,
              }}
            >
              {availableGroupTypesName?.map((areaType) => (
                <option key={areaType} value={areaType}>
                  {areaType}
                </option>
              ))}
            </StyledFilterSelect>
          </ShowHideContainer>

          {availableAreas?.map((area) => {
            const isAreaSelectedValue = isAreaSelected(
              area.code,
              selectedAreasData
            );
            return (
              <Checkbox
                key={`${area.code}-${isAreaSelectedValue}`}
                value={area.code}
                sizeVariant="SMALL"
                name="area"
                defaultChecked={isAreaSelectedValue}
                onChange={(e) =>
                  handleAreaSelected(area.code, e.target.checked)
                }
              >
                {area.name}
              </Checkbox>
            );
          })}
        </ShowHideContainer>
      </StyledFilterDiv>
    </StyledFilterPane>
  );
}
