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
  FormGroup,
  H3,
  LabelText,
  SectionBreak,
  Select,
} from 'govuk-react';
import { Pill } from '@/components/molecules/Pill';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';

interface AreaFilterProps {
  selectedAreasData?: AreaWithRelations[];
  availableAreaTypes?: AreaType[];
  availableGroupTypes?: AreaType[];
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

const StyledFilterDiv = styled('div')({
  backgroundColor: '#E1E2E3',
  minHeight: '100%',
  padding: '1.5em 1em',
});

const StyledFilterLabel = styled(LabelText)({
  fontWeight: 'bold',
});

const StyledFilterSelect = styled(Select)({
  span: {
    fontWeight: 'bold',
  },
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
  availableGroupTypes,
  availableAreas,
  searchState,
}: Readonly<AreaFilterProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchStateManager = SearchStateManager.initialise(searchState);

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
            data-testid="area-type-selector-container"
            input={{
              onChange: (e) =>
                areaTypeSelected(SearchParams.AreaTypeSelected, e.target.value),
              defaultValue: searchState?.[SearchParams.AreaTypeSelected],
              disabled: selectedAreasData && selectedAreasData?.length > 0,
            }}
          >
            {availableAreaTypes?.map((areaType) => (
              <option key={areaType.key} value={areaType.key}>
                {areaType.name}
              </option>
            ))}
          </StyledFilterSelect>

          <StyledFilterSelect
            label="Select a group type"
            data-testid="group-type-selector-container"
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
            {availableGroupTypes?.map((areaType) => (
              <option key={areaType.key} value={areaType.key}>
                {areaType.name}
              </option>
            ))}
          </StyledFilterSelect>

          <FormGroup>
            <StyledFilterLabel>Select one or more areas</StyledFilterLabel>
            {availableAreas?.map((area) => {
              const isAreaSelectedValue = isAreaSelected(
                area.code,
                selectedAreasData
              );

              return (
                <Checkbox
                  key={area.code}
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
          </FormGroup>
        </ShowHideContainer>
      </StyledFilterDiv>
    </StyledFilterPane>
  );
}
