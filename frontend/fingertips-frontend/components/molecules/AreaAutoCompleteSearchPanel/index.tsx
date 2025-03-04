import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import { AreaDocument } from '@/lib/search/searchTypes';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AreaSearchInputField } from '../AreaSearchInputField';
import { AreaAutoCompleteSuggestionPanel } from '../AreaSuggestionPanel';
import { AreaAutoCompletePillPanel } from '../AreaSelectionSearchPillPanel';
import styled from 'styled-components';
import { AreaAutoCompleteFilterPanel } from '../AreaFilterPanel';

const MIN_SEARCH_SIZE = 3;
const DEBOUNCE_SEARCH_DELAY = 300;

const StyleAreaAutoCompleteInputField = styled('div')({
  margin: '0px;',
  backgroundColor: '#FFFFFF',
});

interface AreaAutoCompleteInputFieldProps {
  onAreaSelected: (area: AreaDocument | undefined) => void;
  inputFieldErrorStatus: boolean;
  defaultSelectedAreas: AreaDocument[];
}

export default function AreaAutoCompleteInputField({
  onAreaSelected,
  defaultSelectedAreas,
  inputFieldErrorStatus = false,
}: Readonly<AreaAutoCompleteInputFieldProps>) {
  const [criteria, setCriteria] = useState<string>();
  const [searchAreas, setSearchAreas] = useState<AreaDocument[]>([]);
  const [selectedAreas, setSelectedAreas] =
    useState<AreaDocument[]>(defaultSelectedAreas);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  console.log('Default to criteria =  ' + criteria);

  useEffect(() => {
    setSelectedAreas(defaultSelectedAreas);
    const defaultSelected =
      defaultSelectedAreas.length > 0 ? defaultSelectedAreas[0].areaName : '';
    setCriteria(defaultSelected);
  }, [defaultSelectedAreas]);

  useEffect(() => {
    if (selectedAreas.length !== 0) {
      return;
    }
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
        void fetchSearchArea(criteria);
      },
      DEBOUNCE_SEARCH_DELAY,
      criteria
    );

    return fetchCleanUp;
  }, [criteria, selectedAreas]);

  const removePill = useCallback(
    (area: AreaDocument) => {
      const areas = selectedAreas.filter(
        (selectedArea) => selectedArea.areaCode !== area.areaCode
      );
      setSelectedAreas(areas);
      if (onAreaSelected && areas.length === 0) {
        onAreaSelected(undefined);
      }
      if (areas.length === 0) {
        setCriteria('');
      }
    },
    [selectedAreas, onAreaSelected]
  );

  return (
    <StyleAreaAutoCompleteInputField>
      <AreaSearchInputField
        value={criteria ?? ''}
        onTextChange={setCriteria}
        disabled={selectedAreas.length > 0}
        touched={inputFieldErrorStatus}
      />
      <AreaAutoCompletePillPanel
        areas={selectedAreas}
        onRemovePill={removePill}
      />
      <AreaAutoCompleteSuggestionPanel
        areas={searchAreas}
        searchHint={criteria ?? ''}
        onItemSelected={(selectedArea: AreaDocument) => {
          setSelectedAreas([selectedArea]);
          setCriteria(selectedArea.areaName);
          setSearchAreas([]);
          if (onAreaSelected) {
            onAreaSelected(selectedArea);
          }
        }}
      />
      <AreaAutoCompleteFilterPanel areas={selectedAreas} />
    </StyleAreaAutoCompleteInputField>
  );
}
