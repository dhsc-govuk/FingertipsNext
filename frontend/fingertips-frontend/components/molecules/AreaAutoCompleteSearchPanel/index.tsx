import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import { AreaDocument } from '@/lib/search/searchTypes';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AreaSearchInputField } from '../AreaSearchInputField';
import { AreaSuggestionPanel } from '../AreaSuggestionPanel';
import { AreaSelectionSearchPillPanel } from '../AreaSelectionSearchPillPanel';
import styled from 'styled-components';
import { AreaFilterPanel } from '../AreaFilterPanel';

const MIN_SEARCH_SIZE = 3;
const DEBOUNCE_SEARCH_DELAY = 300;

const enum SearchStatusType {
  PROCESSING,
  COMPLETED,
}

const StyleAreaSelectAutoCompletePanel = styled('div')({
  margin: '0px;',
  backgroundColor: '#FFFFFF',
});

interface AreaSelectAutoCompleteProps {
  onAreaSelected: (area: AreaDocument) => void;
  inputFieldErrorStatus: boolean;
  defaultValue: string;
}

export default function AreaAutoCompleteSearchPanel({
  onAreaSelected,
  defaultValue,
  inputFieldErrorStatus = false,
}: AreaSelectAutoCompleteProps) {
  const [criteria, setCriteria] = useState<string>(defaultValue);
  const [searchStatus, setSearchStatus] = useState<SearchStatusType>(
    SearchStatusType.COMPLETED
  );
  const [searchAreas, setSearchAreas] = useState<AreaDocument[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<AreaDocument[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const fetchSearchArea = async (criteria: string) => {
      if (criteria && searchStatus === SearchStatusType.PROCESSING) {
        const areas = await getSearchSuggestions(criteria);
        setSearchAreas(areas.slice(0, 20));
        setSearchStatus(SearchStatusType.COMPLETED);
      }
    };

    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(
      (criteria: string, status: SearchStatusType) => {
        if (status !== SearchStatusType.PROCESSING) return;
        if (criteria == null || criteria.length < MIN_SEARCH_SIZE) {
          setSearchAreas([]);
          return;
        }
        fetchSearchArea(criteria);

        if (timeoutRef.current != null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      },
      DEBOUNCE_SEARCH_DELAY,
      criteria,
      searchStatus
    );

    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [searchStatus, criteria]);

  const searchAreaSelectedHandler = useCallback(
    (area: AreaDocument) => {
      const areas = selectedAreas.filter(
        (selectedArea) => selectedArea.areaCode !== area.areaCode
      );
      setSelectedAreas(areas);
    },
    [selectedAreas]
  );

  return (
    <StyleAreaSelectAutoCompletePanel>
      <AreaSearchInputField
        value={criteria}
        onTextChange={(newCriteria: string) => {
          setCriteria(newCriteria);
          if (searchStatus === SearchStatusType.COMPLETED) {
            setSearchStatus(SearchStatusType.PROCESSING);
          }
        }}
        disabled={selectedAreas.length > 0}
        touched={inputFieldErrorStatus}
      />
      <AreaSelectionSearchPillPanel
        areas={selectedAreas}
        onClick={searchAreaSelectedHandler}
      />
      <AreaSuggestionPanel
        areas={searchAreas}
        onItemSelected={(selectedArea: AreaDocument) => {
          setSelectedAreas([selectedArea]);
          setSearchAreas([]);
          onAreaSelected?.(selectedArea);
        }}
      />
      <AreaFilterPanel areas={selectedAreas} onOpen={() => {}} />
    </StyleAreaSelectAutoCompletePanel>
  );
}
