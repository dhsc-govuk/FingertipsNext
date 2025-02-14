import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import { AreaDocument } from '@/lib/search/searchTypes';
import React, { useEffect, useState } from 'react';
import { AreaSearchInputField } from '../AreaSearchInputField';
import { AreaSuggestionPanel } from '../AreaSuggestionPanel';
import { AreaSelectionSearchPillPanel } from '../AreaSelectionSearchPillPanel';
import styled from 'styled-components';
import { AreaFilterPanel } from '../AreaFilterPanel';

const MIN_SEARCH_SIZE = 3;

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
  defaultValue: string | undefined;
}

export default function AreaAutoCompleteSearchPanel({
  onAreaSelected,
  defaultValue,
  inputFieldErrorStatus = false,
}: AreaSelectAutoCompleteProps) {
  const [criteria, setCriteria] = useState<string>();
  const [searchStatus, setSearchStatus] = useState<SearchStatusType>(
    SearchStatusType.COMPLETED
  );
  const [searchAreas, setSearchAreas] = useState<AreaDocument[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<AreaDocument[]>([]);

  useEffect(() => {
    const fetchSearchArea = async (criteria: string | undefined) => {
      if (criteria && searchStatus === SearchStatusType.PROCESSING) {
        const areas = await getSearchSuggestions(criteria);
        setSearchAreas(areas.slice(0, 20));
        setSearchStatus(SearchStatusType.COMPLETED);
      }
    };

    if (searchStatus === SearchStatusType.PROCESSING) {
      fetchSearchArea(criteria);
    }
  }, [searchStatus, criteria]);

  return (
    <StyleAreaSelectAutoCompletePanel>
      <AreaSearchInputField
        defaultValue={defaultValue}
        onTextChange={(newCriteria: string) => {
          if (newCriteria.length < MIN_SEARCH_SIZE) {
            setSearchAreas([]);
            return;
          }
          if (searchStatus === SearchStatusType.COMPLETED) {
            setCriteria(newCriteria);
            setSearchStatus(SearchStatusType.PROCESSING);
          }
        }}
        disabled={selectedAreas.length > 0}
        touched={inputFieldErrorStatus}
      />
      <AreaSelectionSearchPillPanel
        areas={selectedAreas}
        onClick={(area: AreaDocument) => {
          const areas = selectedAreas.filter(
            (selectedArea) => selectedArea.areaCode !== area.areaCode
          );
          setSelectedAreas(areas);
        }}
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
