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
import { Checkbox, FormGroup, LabelText, Select } from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';

export type AreaFilterData = {
  availableAreaTypes?: AreaType[];
  availableGroupTypes?: AreaType[];
  availableGroups?: Area[];
  availableAreas?: Area[];
};

interface SelectAreasFilterPanelProps {
  selectedAreasData?: AreaWithRelations[];
  areaFilterData?: AreaFilterData;
  searchState?: SearchStateParams;
}

const StyledFilterSelect = styled(Select)({
  span: {
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
  },
  marginBottom: '1em',
});

const StyledFilterLabel = styled(LabelText)({
  fontWeight: 'bold',
});

const isAreaSelected = (areaCode: string, selectedAreas?: Area[]): boolean =>
  selectedAreas ? selectedAreas?.some((area) => area.code === areaCode) : false;

export function SelectAreasFilterPanel({
  selectedAreasData,
  areaFilterData,
  searchState,
}: Readonly<SelectAreasFilterPanelProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

  // const { availableAreaTypes, availableGroupTypes, availableGroups. availableAreas} = areaFilterData;
  const searchStateManager = SearchStateManager.initialise(searchState);

  const areaTypeSelected = (valueSelected: string) => {
    searchStateManager.addParamValueToState(
      SearchParams.AreaTypeSelected,
      valueSelected
    );
    searchStateManager.removeParamValueFromState(
      SearchParams.GroupTypeSelected
    );
    searchStateManager.removeParamValueFromState(SearchParams.GroupSelected);
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const groupTypeSelected = (valueSelected: string) => {
    searchStateManager.addParamValueToState(
      SearchParams.GroupTypeSelected,
      valueSelected
    );
    searchStateManager.removeParamValueFromState(SearchParams.GroupSelected);
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const groupSelected = (valueSelected: string) => {
    searchStateManager.addParamValueToState(
      SearchParams.GroupSelected,
      valueSelected
    );
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

  return (
    <div data-testid="select-areas-filter-panel">
      <StyledFilterSelect
        label="Select an area type"
        data-testid="area-type-selector-container"
        input={{
          onChange: (e) => areaTypeSelected(e.target.value),
          defaultValue: searchState?.[SearchParams.AreaTypeSelected],
          disabled: selectedAreasData && selectedAreasData?.length > 0,
        }}
      >
        {areaFilterData?.availableAreaTypes?.map((areaType) => (
          <option key={areaType.key} value={areaType.key}>
            {areaType.name}
          </option>
        ))}
      </StyledFilterSelect>

      <StyledFilterSelect
        label="Select a group type"
        data-testid="group-type-selector-container"
        input={{
          onChange: (e) => groupTypeSelected(e.target.value),
          defaultValue: searchState?.[SearchParams.GroupTypeSelected],
          disabled: selectedAreasData && selectedAreasData?.length > 0,
        }}
      >
        {areaFilterData?.availableGroupTypes?.map((areaType) => (
          <option key={areaType.key} value={areaType.key}>
            {areaType.name}
          </option>
        ))}
      </StyledFilterSelect>

      <StyledFilterSelect
        label="Select a group"
        input={{
          onChange: (e) => groupSelected(e.target.value),
          defaultValue: searchState?.[SearchParams.GroupSelected],
          disabled: selectedAreasData && selectedAreasData?.length > 0,
        }}
      >
        {areaFilterData?.availableGroups?.map((area) => (
          <option key={area.code} value={area.code}>
            {area.name}
          </option>
        ))}
      </StyledFilterSelect>

      <FormGroup>
        <StyledFilterLabel>Select one or more areas</StyledFilterLabel>
        {areaFilterData?.availableAreas?.map((area) => {
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
              onChange={(e) => handleAreaSelected(area.code, e.target.checked)}
            >
              {area.name}
            </Checkbox>
          );
        })}
      </FormGroup>
    </div>
  );
}
