'use client';

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
  Paragraph,
} from 'govuk-react';
import { typography } from '@govuk-react/lib';
import { Pill } from '@/components/molecules/Pill';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';

interface AreaFilterProps {
  selectedAreasData?: AreaWithRelations[];
  availableAreaTypes?: AreaType[];
  availableGroupTypes?: AreaType[];
  availableGroups?: Area[];
  availableAreas?: Area[];
  searchState?: SearchStateParams;
}

const StyledFilterPane = styled('div')({});

const StyledParagraph = styled(Paragraph)(
  {
    marginBottom: '0',
  },
  typography.font({ size: 16 })
);

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

const isAreaSelected = (areaCode: string, selectedAreas?: Area[]): boolean =>
  selectedAreas ? selectedAreas?.some((area) => area.code === areaCode) : false;

export function AreaFilter({
  selectedAreasData,
  availableAreaTypes,
  availableGroupTypes,
  availableGroups,
  availableAreas,
  searchState,
}: Readonly<AreaFilterProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

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
                  selectedFilterId={selectedArea.code}
                  removeFilter={removeSelectedArea}
                >
                  <StyledParagraph>{selectedArea.name}</StyledParagraph>
                </Pill>
              ))
            : null}
        </StyledFilterSelectedAreaDiv>

        <ShowHideContainer summary="Add or change areas">
          <StyledFilterSelect
            label="Select an area type"
            data-testid="area-type-selector-container"
            input={{
              onChange: (e) => areaTypeSelected(e.target.value),
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
              onChange: (e) => groupTypeSelected(e.target.value),
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

          <StyledFilterSelect
            label="Select a group"
            input={{
              onChange: (e) => groupSelected(e.target.value),
              defaultValue: searchState?.[SearchParams.GroupSelected],
              disabled: selectedAreasData && selectedAreasData?.length > 0,
            }}
          >
            {availableGroups?.map((area) => (
              <option key={area.code} value={area.code}>
                {area.name}
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
