import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import { AreaDocument } from '@/lib/search/searchTypes';
import React, { useEffect, useState, useRef } from 'react';
import { AreaSearchInputField } from '@/components/molecules/AreaSearchInputField';
import { AreaAutoCompleteSuggestionPanel } from '@/components/molecules/AreaSuggestionPanel';
import styled from 'styled-components';
import { SearchParams } from '@/lib/searchStateManager';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { useSearchState } from '@/context/SearchStateContext';

const MIN_SEARCH_SIZE = 3;
const DEBOUNCE_SEARCH_DELAY = 300;
const MAX_SUGGESTED_AREA_LIMIT = 20;

const StyleAreaAutoCompleteInputField = styled('div')({
  marginBottom: '1em',
});

interface AreaAutoCompleteInputFieldProps {
  inputFieldErrorStatus: boolean;
  selectedAreaName?: string;
}

export function AreaAutoCompleteInputField({
  inputFieldErrorStatus = false,
  selectedAreaName,
}: Readonly<AreaAutoCompleteInputFieldProps>) {
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();

  const selectedAreasParams = searchState?.[SearchParams.AreasSelected];

  const [criteria, setCriteria] = useState<string>();
  const [searchAreas, setSearchAreas] = useState<AreaDocument[]>([]);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedAreaName) {
      setCriteria(selectedAreaName ?? '');
    }

    const fetchSearchArea = async (criteria: string) => {
      if (criteria) {
        const areas = await getSearchSuggestions(criteria);
        setSearchAreas(areas.slice(0, MAX_SUGGESTED_AREA_LIMIT));
      }
    };

    const fetchCleanUp = () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    fetchCleanUp();

    timeoutRef.current = setTimeout(
      (criteria: string) => {
        if (
          selectedAreaName ||
          criteria == null ||
          criteria.length < MIN_SEARCH_SIZE
        ) {
          setSearchAreas([]);
          return;
        }
        fetchSearchArea(criteria);
      },
      DEBOUNCE_SEARCH_DELAY,
      criteria
    );

    return fetchCleanUp;
  }, [criteria, selectedAreaName]);

  return (
    <StyleAreaAutoCompleteInputField>
      <AreaSearchInputField
        value={criteria}
        onTextChange={setCriteria}
        disabled={
          (selectedAreasParams && selectedAreasParams?.length > 0) ||
          searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED
        }
        hasError={inputFieldErrorStatus}
      />
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={searchAreas}
        searchHint={criteria ?? ''}
      />
    </StyleAreaAutoCompleteInputField>
  );
}
