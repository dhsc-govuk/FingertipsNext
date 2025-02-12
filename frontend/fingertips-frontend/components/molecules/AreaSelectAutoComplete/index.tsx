import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import { AREA_TYPE_GP, AreaDocument } from '@/lib/search/searchTypes';
import { InputField } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import React, { useState } from 'react';
import styled from 'styled-components';
import { InputProps } from '@govuk-react/input';
import { AreaSuggestionPanel } from '../AreaSuggestionPanel';
import { AreaSearchInputField } from '../AreaSearchInputField';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

interface AreaSelectAutoCompleteProps {
  hint?: React.ReactNode;
  input?: InputProps;
  meta?: {
    error?: string | string[];
    touched?: boolean;
  };
  areaSelected: AreaDocument | undefined;
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

export default function AreaSelectAutoComplete({
  input,
  hint,
  meta,
  areaSelected,
  onSelectHandler,
}: AreaSelectAutoCompleteProps) {
  const [suggestedAreas, setSuggestedAreas] = useState<AreaDocument[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaDocument | undefined>(
    areaSelected
  );
  return (
    <div>
      <AreaSearchInputField
        value={selectedArea?.areaName}
        onTextChange={(criteria: string) => {
          console.log('Criteria = ', criteria);
        }}
      />
      <AreaSuggestionPanel
        areas={suggestedAreas}
        onItemSelected={onSelectHandler}
      />
    </div>
  );
}
