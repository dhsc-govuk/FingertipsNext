import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import { AREA_TYPE_GP, AreaDocument } from '@/lib/search/searchTypes';
import { InputField, SearchBox, Table } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import React, { useState } from 'react';
import styled from 'styled-components';
import { InputProps } from '@govuk-react/input';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

interface AreaSelectWithSuggestionsProps {
  hint?: React.ReactNode;
  input?: InputProps;
  meta?: {
    error?: string | string[];
    touched?: boolean;
  };
  onSelectHandler: (areaCode: string) => void;
}

async function generateAreaSuggestions(
  partialText: string
): Promise<AreaDocument[]> {
  if (partialText.length < 3) return [];
  else {
    const areas = await getSearchSuggestions(partialText);
    return areas.slice(0, 20);
  }
}

function formatAreaName(area: AreaDocument): string {
  return area.areaType === AREA_TYPE_GP
    ? `${area.areaCode} - ${area.areaName}`
    : area.areaName;
}

export default function AreaSelectWithSuggestions({
  input,
  hint,
  meta,
  onSelectHandler,
}: AreaSelectWithSuggestionsProps) {
  const [suggestedAreas, setSuggestedAreas] = useState<AreaDocument[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaDocument>();
  return (
    <div>
      <StyledInputField
        style={{ marginBottom: '5px' }}
        input={{
          ...input,
          value: selectedArea ? formatAreaName(selectedArea) : undefined,
          onChange: async (e) => {
            setSelectedArea(undefined);
            setSuggestedAreas(await generateAreaSuggestions(e.target.value));
          },
        }}
        hint={hint}
        meta={meta}
        data-testid="search-form-input-area"
      >
        Search for an area by location or organisation
      </StyledInputField>

      <Table>
        {suggestedAreas.map((area) => (
          <Table.Row
            key={`${area.areaCode}`}
            onClick={() => {
              onSelectHandler(area.areaCode);
              setSelectedArea(area);
              setSuggestedAreas([]);
            }}
          >
            <Table.Cell>{formatAreaName(area)}</Table.Cell>
            <Table.Cell>{area.areaType}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
