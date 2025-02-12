import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import { AREA_TYPE_GP, AreaDocument } from '@/lib/search/searchTypes';
import React, { useEffect, useState } from 'react';
import { AreaSearchInputField } from '../AreaSearchInputField';
import { AreaSuggestionPanel } from '../AreaSuggestionPanel';
import { time } from 'console';
import { selectOptions } from '@testing-library/user-event/dist/cjs/utility/selectOptions.js';

const enum SearchStatusType {
  PROCESSING,
  COMPLETED,
}

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

  useEffect(() => {
    const fetchSearchArea = async (
      criteria: string | undefined,
      status: SearchStatusType
    ) => {
      if (searchStatus == SearchStatusType.PROCESSING) {
        if (criteria != null) {
          // Sync with  backend.
          const areas = await getSearchSuggestions(criteria);
          console.log(criteria);
          console.log('Search Status = ', status);
          console.log(areas);
          setSearchAreas(areas);
          setSearchStatus(SearchStatusType.COMPLETED);
        }
      }
    };
    fetchSearchArea(criteria, searchStatus);
  }, [searchStatus, criteria]);

  //handle on AreaSuggestionListPanel selection

  const onSelectHandler = (item) => {
    console.log(item);
  };

  return (
    <div>
      <AreaSearchInputField
        value={area?.areaName}
        onTextChange={(criteria: string) => {
          if (searchStatus == SearchStatusType.COMPLETED) {
            setCriteria(criteria);
            setSearchStatus(SearchStatusType.PROCESSING);
          }
        }}
      />
      <AreaSuggestionPanel
        areas={searchAreas}
        onItemSelected={onSelectHandler}
      />
    </div>
  );
}
