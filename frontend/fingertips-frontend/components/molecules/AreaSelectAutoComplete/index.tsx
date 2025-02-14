import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import { AREA_TYPE_GP, AreaDocument } from '@/lib/search/searchTypes';
import React, { useEffect, useState } from 'react';
import { AreaSearchInputField } from '../AreaSearchInputField';
import { AreaSuggestionPanel } from '../AreaSuggestionPanel';
import { AreaSearchPillPanel } from '../AreaSearchPillPanel';
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
  onSelect: (areaCode: string) => void;
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
  area,
  onSelect,
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
      />
      <AreaSearchPillPanel
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
        }}
      />

      <AreaFilterPanel areas={selectedAreas} />
    </StyleAreaSelectAutoCompletePanel>
  );
}
