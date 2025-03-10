import { Area, AreaType } from '@/generated-sources/ft-api-client';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import {
  Checkbox,
  FormGroup,
  LabelText,
  SectionBreak,
  Select,
} from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';

export type AreaFilterData = {
  availableAreaTypes?: AreaType[];
  availableGroupTypes?: AreaType[];
  availableGroups?: Area[];
  availableAreas?: Area[];
};

interface SelectAreasFilterPanelProps {
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

const isAreaSelected = (
  areaCode: string,
  selectedAreas?: string[],
  groupAreaSelected?: string
): boolean => {
  if (groupAreaSelected === 'ALL') return true;

  return selectedAreas
    ? selectedAreas?.some((area) => area === areaCode)
    : false;
};

export function SelectAreasFilterPanel({
  areaFilterData,
  searchState,
}: Readonly<SelectAreasFilterPanelProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const hasAreasSelected =
    (searchState?.[SearchParams.AreasSelected] &&
      searchState?.[SearchParams.AreasSelected].length > 0) ||
    searchState?.[SearchParams.GroupAreaSelected] === 'ALL';

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

  const handleAllAreasSelected = (checked: boolean) => {
    if (checked) {
      searchStateManager.removeAllParamFromState(SearchParams.AreasSelected);
      searchStateManager.addParamValueToState(
        SearchParams.GroupAreaSelected,
        'ALL'
      );
    } else {
      searchStateManager.removeParamValueFromState(
        SearchParams.GroupAreaSelected
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
          disabled: hasAreasSelected,
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
          disabled: hasAreasSelected,
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
          disabled: hasAreasSelected,
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
        <Checkbox
          value={searchState?.[SearchParams.GroupSelected]}
          sizeVariant="SMALL"
          defaultChecked={
            searchState?.[SearchParams.GroupAreaSelected] === 'ALL'
          }
          onChange={(e) => handleAllAreasSelected(e.target.checked)}
        >
          Select all areas
        </Checkbox>
        <SectionBreak visible />
        {areaFilterData?.availableAreas?.map((area) => {
          const isAreaSelectedValue = isAreaSelected(
            area.code,
            searchState?.[SearchParams.AreasSelected],
            searchState?.[SearchParams.GroupAreaSelected]
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
