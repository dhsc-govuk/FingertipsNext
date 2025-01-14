/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectedFilterTag } from '@/components/molecules/SelectedFilterTag';
import {
  Checkbox,
  Details,
  H3,
  HintText,
  Label,
  LabelText,
  Link,
  SectionBreak,
  Select,
} from 'govuk-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { updateAreasSelected } from './server-actions';
import { SearchState, SearchStateManager } from '@/lib/searchStateManager';
import { SearchResultState } from '@/components/pages/search/results/searchResultsActions';

interface GeographyFilterProps {
  selectedAreaCodesData: any[];
  availableGroupTypes: any[];
  availableGroups: any[];
  availableAreasInGroup: any[];
}

const StyledFilterDiv = styled('div')({
  backgroundColor: '#E1E2E3',
  minHeight: '100%',
  padding: '0.5em',
});

const StyledFilterSelect = styled(Select)({
  width: '500px',
});

const StyledFilterSelect2 = styled(Select)({
  width: '450px',
});

const isAreaSelected = (areaId: string, state?: SearchState): boolean => {
  return state?.areasSelected
    ? state.areasSelected?.some((area) => area === areaId)
    : false;
};

export function GeographyFilter({
  selectedAreaCodesData,
  availableGroupTypes,
  availableGroups,
  availableAreasInGroup,
}: Readonly<GeographyFilterProps>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const existingParams = new URLSearchParams(searchParams);
  const searchState = SearchStateManager.setStateFromParams(existingParams);

  const handleSelectAreaClick = async (areaId: string, checked: boolean) => {
    if (checked) {
      searchState.addAreaSelected(areaId);
    } else {
      searchState.removeAreaSelected(areaId);
    }
    replace(searchState.generatePath(pathname), { scroll: false });
    // const operation = checked ? 'ADD' : 'REMOVE';
    // await updateAreasSelected(areaId, operation, searchState.getSearchState());
  };

  return (
    <StyledFilterDiv>
      <H3>Filters</H3>
      <SectionBreak visible={true} />
      <br />
      <LabelText>Areas Selected</LabelText>
      {selectedAreaCodesData.map((selectedArea) => (
        <SelectedFilterTag
          key={selectedArea.id}
          selectedFilterName={selectedArea.name}
        />
      ))}
      <br />
      <Details summary="Add or change areas" open={true}>
        <StyledFilterSelect label="Select an area type">
          <option value="0">Integrated Care Board sub-location</option>
        </StyledFilterSelect>
        <br />
        <Label>
          <LabelText>Area List</LabelText>
          <HintText>Select one or more areas to compare</HintText>
          <Details summary="Refine the area list" open={true}>
            <StyledFilterSelect2 label="1. Select a group type">
              {availableGroupTypes.map((groupType) => (
                <option key={groupType.id} value={groupType.id}>
                  {groupType.name}
                </option>
              ))}
            </StyledFilterSelect2>
            <br />
            <StyledFilterSelect2 label="2. Select a group">
              {availableGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </StyledFilterSelect2>
          </Details>
          <Checkbox sizeVariant="SMALL">
            Select all areas in this group
          </Checkbox>
          <SectionBreak visible={true} />
          {availableAreasInGroup.map((area) => (
            <Checkbox
              key={area.id}
              value={area.id}
              sizeVariant="SMALL"
              defaultChecked={isAreaSelected(
                area.id,
                searchState.getSearchState()
              )}
              onChange={async (e) => {
                await handleSelectAreaClick(area.id, e.target.checked);
              }}
            >
              {area.name}
            </Checkbox>
          ))}
        </Label>
        <Link href="#">Or search for an area by location or organisation</Link>
        <br />
        <br />
        <LabelText>Selected areas</LabelText>
      </Details>
    </StyledFilterDiv>
  );
}
