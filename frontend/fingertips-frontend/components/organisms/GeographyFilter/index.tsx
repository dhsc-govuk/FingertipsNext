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
              <option value="0">Integrated Care Board</option>
            </StyledFilterSelect2>
            <br />
            <StyledFilterSelect2 label="2. Select a group">
              <option value="0">Greater Manchester ICB - QOP</option>
            </StyledFilterSelect2>
          </Details>
          <Checkbox sizeVariant="SMALL">
            Select all areas in this group
          </Checkbox>
          <SectionBreak visible={true} />
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 001</Checkbox>
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 002</Checkbox>
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 003</Checkbox>
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 004</Checkbox>
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 005</Checkbox>
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 006</Checkbox>
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 007</Checkbox>
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 008</Checkbox>
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 009</Checkbox>
          <Checkbox sizeVariant="SMALL">Greater Manchester ICB - 010</Checkbox>
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
