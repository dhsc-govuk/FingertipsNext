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
import styled from 'styled-components';

interface GeographyFilterProps {
  selectedAreas: string;
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

export function GeographyFilter({
  selectedAreas,
  availableGroupTypes,
  availableGroups,
  availableAreasInGroup,
}: Readonly<GeographyFilterProps>) {
  return (
    <StyledFilterDiv>
      <H3>Filters</H3>
      <SectionBreak visible={true} />
      <br />
      <LabelText>Areas Selected</LabelText>
      <SelectedFilterTag selectedFilterName={selectedAreas} />
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
            <Checkbox key={area.id} value={area.id} sizeVariant="SMALL">
              {area.name}
            </Checkbox>
          ))}
        </Label>
        <Link href="#">Or search for an area by location or organisation</Link>
        <br />
        <br />
        <LabelText>Selected areas</LabelText>
        <SelectedFilterTag selectedFilterName={selectedAreas} />
      </Details>
    </StyledFilterDiv>
  );
}
