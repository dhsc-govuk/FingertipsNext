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

const StyleAreaSelectAutoCompletePanel = styled('div')({
  margin: '0px;',
  backgroundColor: '#FFFFFF',
});

interface AreaSelectAutoCompleteProps {
  onAreaSelected: (area: AreaDocument | undefined) => void;
  inputFieldErrorStatus: boolean;
  defaultSelectedAreas: AreaDocument[];
}

export default function AreaAutoCompleteSearchPanel({
  onAreaSelected,
  defaultSelectedAreas,
  inputFieldErrorStatus = false,
}: AreaSelectAutoCompleteProps) {
  const [criteria, setCriteria] = useState<string>();
  const [searchAreas, setSearchAreas] = useState<AreaDocument[]>([]);
  const [selectedAreas, setSelectedAreas] =
    useState<AreaDocument[]>(defaultSelectedAreas);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setSelectedAreas(defaultSelectedAreas);
  }, [defaultSelectedAreas]);

  useEffect(() => {
    const fetchSearchArea = async (criteria: string) => {
      if (criteria) {
        const areas = await getSearchSuggestions(criteria);
        setSearchAreas(areas.slice(0, 20));
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
        if (criteria == null || criteria.length < MIN_SEARCH_SIZE) {
          setSearchAreas([]);
          return;
        }
        console.log('Fetching ', criteria);
        fetchSearchArea(criteria);
      },
      DEBOUNCE_SEARCH_DELAY,
      criteria
    );

    return fetchCleanUp;
  }, [criteria]);

  const handlePillRemoval = useCallback(
    (area: AreaDocument) => {
      const areas = selectedAreas.filter(
        (selectedArea) => selectedArea.areaCode !== area.areaCode
      );
      setSelectedAreas(areas);
      //now we can let the users know the areas selected.
      if (onAreaSelected) {
        if (areas.length == 0) {
          onAreaSelected(undefined);
        }
      }
    },
    [selectedAreas, onAreaSelected]
  );

  return (
    <StyleAreaSelectAutoCompletePanel>
      <AreaSearchInputField
        value={criteria}
        onTextChange={(newCriteria: string) => {
          setCriteria(newCriteria);
        }}
        disabled={selectedAreas.length > 0}
        touched={inputFieldErrorStatus}
      />
      <AreaSelectionSearchPillPanel
        areas={selectedAreas}
        onRemovePill={handlePillRemoval}
      />
      <AreaSuggestionPanel
        areas={searchAreas}
        onItemSelected={(selectedArea: AreaDocument) => {
          setSelectedAreas([selectedArea]);
          setSearchAreas([]);
          if (onAreaSelected) {
            onAreaSelected(selectedArea);
          }
        }}
      />
      <AreaFilterPanel areas={selectedAreas} onOpen={() => {}} />
    </StyleAreaSelectAutoCompletePanel>
  );
}
