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
  area?: AreaDocument;
  onAreaSelected: (area: AreaDocument) => void;
  inputFieldErrorStatus: boolean;
}

export default function AreaAutoCompleteSearchPanel({
  area,
  onAreaSelected,
  inputFieldErrorStatus = false,
}: AreaSelectAutoCompleteProps) {
  const [criteria, setCriteria] = useState<string>();
  const [searchStatus, setSearchStatus] = useState<SearchStatusType>(
    SearchStatusType.COMPLETED
  );
  const [searchAreas, setSearchAreas] = useState<AreaDocument[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<AreaDocument[]>([]);
  useEffect(() => {
    const fetchSearchArea = async (
      criteria: string | undefined,
      status: SearchStatusType
    ) => {
      if (status == SearchStatusType.PROCESSING) {
        if (criteria != null) {
          const areas = await getSearchSuggestions(criteria);
          setSearchAreas(areas.slice(0, 20));
          setSearchStatus(SearchStatusType.COMPLETED);
        }
      }
    };
    fetchSearchArea(criteria, searchStatus);
  }, [searchStatus, criteria]);

  return (
    <StyleAreaSelectAutoCompletePanel>
      <AreaSearchInputField
        value={area?.areaName}
        onTextChange={(criteria: string) => {
          if (criteria.length < MIN_SEARCH_SIZE) {
            setSearchAreas([]);
            return;
          }
          if (searchStatus == SearchStatusType.COMPLETED) {
            setCriteria(criteria);
            setSearchStatus(SearchStatusType.PROCESSING);
          }
        }}
        disabled={selectedAreas.length > 0}
        touched={inputFieldErrorStatus}
      />
      <AreaSelectionSearchPillPanel
        areas={selectedAreas}
        onClick={(area: AreaDocument) => {
          // remove the area from the list of selected areas
          const areas = selectedAreas.filter((selectedArea: AreaDocument) => {
            if (selectedArea.areaCode != area.areaCode) return selectedArea;
          });
          setSelectedAreas(areas);
        }}
      />
      <AreaSuggestionPanel
        areas={searchAreas}
        onItemSelected={(selectedArea: AreaDocument) => {
          setSelectedAreas([selectedArea]);
          setSearchAreas([]);
          if (onAreaSelected != null) {
            onAreaSelected(selectedArea);
          }
        }}
      />

      <AreaFilterPanel areas={selectedAreas} onOpen={() => {}} />
    </StyleAreaSelectAutoCompletePanel>
  );
}
