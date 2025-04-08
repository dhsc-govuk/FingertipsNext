import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';
import { Area, AreaType } from '@/generated-sources/ft-api-client';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import {
  Checkbox,
  FormGroup,
  LabelText,
  SectionBreak,
  Select,
} from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { AreaFilterPaneCheckboxes } from '@/components/organisms/AreaFilterPane/AreaFilterPaneCheckboxes';

export type AreaFilterData = {
  availableAreaTypes?: AreaType[];
  availableGroupTypes?: AreaType[];
  availableGroups?: Area[];
  availableAreas?: Area[];
};

interface SelectAreasFilterPanelProps {
  areaFilterData?: AreaFilterData;
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

const StyledSectionBreak = styled(SectionBreak)({
  borderBottomColor: 'black',
  marginBottom: '0.5em',
});

const StyledSelectAllCheckBox = styled(Checkbox)({
  marginBottom: '0em',
});

export function SelectAreasFilterPanel({
  areaFilterData,
}: Readonly<SelectAreasFilterPanelProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const hasAreasSelected =
    (searchState?.[SearchParams.AreasSelected] &&
      searchState?.[SearchParams.AreasSelected].length > 0) ||
    searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED;

  const areaTypeSelected = (valueSelected: string) => {
    setIsLoading(true);

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
    setIsLoading(true);

    searchStateManager.addParamValueToState(
      SearchParams.GroupTypeSelected,
      valueSelected
    );
    searchStateManager.removeParamValueFromState(SearchParams.GroupSelected);
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const groupSelected = (valueSelected: string) => {
    setIsLoading(true);

    searchStateManager.addParamValueToState(
      SearchParams.GroupSelected,
      valueSelected
    );
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const handleAreaSelected = (areaCode: string, checked: boolean) => {
    setIsLoading(true);

    if (
      searchState?.[SearchParams.AreasSelected]?.length === 1 &&
      searchState?.[SearchParams.AreasSelected][0] === areaCodeForEngland
    ) {
      searchStateManager.removeAllParamFromState(SearchParams.AreasSelected);
    }

    if (checked) {
      searchStateManager.addParamValueToState(
        SearchParams.AreasSelected,
        areaCode
      );

      const updatedAreasSelected =
        searchStateManager.getSearchState()?.[SearchParams.AreasSelected];

      if (
        areaFilterData?.availableAreas &&
        areaFilterData?.availableAreas?.length > 0 &&
        areaFilterData?.availableAreas?.length === updatedAreasSelected?.length
      ) {
        searchStateManager.removeAllParamFromState(SearchParams.AreasSelected);
        searchStateManager.addParamValueToState(
          SearchParams.GroupAreaSelected,
          ALL_AREAS_SELECTED
        );
      }
    } else if (
      !checked &&
      searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED
    ) {
      searchStateManager.removeParamValueFromState(
        SearchParams.GroupAreaSelected
      );

      const remainingAreasSelected = areaFilterData?.availableAreas
        ?.filter((area) => {
          return area.code !== areaCode;
        })
        .map((area) => area.code);

      searchStateManager.addAllParamsToState(
        SearchParams.AreasSelected,
        remainingAreasSelected ?? []
      );
    } else {
      searchStateManager.removeParamValueFromState(
        SearchParams.AreasSelected,
        areaCode
      );
    }

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const handleSelectAllAreasSelected = (checked: boolean) => {
    setIsLoading(true);

    if (checked) {
      searchStateManager.removeAllParamFromState(SearchParams.AreasSelected);
      searchStateManager.addParamValueToState(
        SearchParams.GroupAreaSelected,
        ALL_AREAS_SELECTED
      );
    } else {
      searchStateManager.removeParamValueFromState(
        SearchParams.GroupAreaSelected
      );
      searchStateManager.removeAllParamFromState(SearchParams.AreasSelected);
    }

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const rows = areaFilterData?.availableAreas ?? [];

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
        data-testid="group-selector-container"
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
        <StyledSelectAllCheckBox
          value={searchState?.[SearchParams.GroupSelected]}
          sizeVariant="SMALL"
          defaultChecked={
            searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED
          }
          onChange={(e) => handleSelectAllAreasSelected(e.target.checked)}
        >
          Select all areas
        </StyledSelectAllCheckBox>
        <StyledSectionBreak visible />
        <AreaFilterPaneCheckboxes
          rows={rows}
          searchState={searchState}
          handleAreaSelected={handleAreaSelected}
        />
      </FormGroup>
    </div>
  );
}
