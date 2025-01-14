import { SearchResults } from '@/components/pages/search/results';
import {
  getAreaData,
  getAvailableAreasInGroup,
  getAvailableGroups,
  getAvailableGroupTypes,
  getSearchData,
} from './search-result-data';
import { SearchStateParams } from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator =
    searchParams?.[SearchParams.SearchedIndicator] ?? '';
  const indicatorsSelected = asArray(
    searchParams?.[SearchParams.IndicatorsSelected]
  );
  const searchedAreaCode = '00T';

  // Perform async API call using indicator prop
  const searchResults = getSearchData();
  const selectedAreaCodeData = getAreaData(searchedAreaCode);
  const availableGroupTypes = getAvailableGroupTypes(
    selectedAreaCodeData.groupType
  );
  const availableGroups = getAvailableGroups(selectedAreaCodeData.group);
  const availableAreasInGroup = getAvailableAreasInGroup(
    selectedAreaCodeData.group
  );

  const initialState = {
    searchedIndicator,
    indicatorsSelected,
    message: null,
    errors: {},
  };

  return (
    <SearchResults
      searchResultsFormState={initialState}
      searchResults={searchResults}
      selectedAreaCodeData={selectedAreaCodeData}
      availableGroupTypes={availableGroupTypes}
      availableGroups={availableGroups}
      availableAreasInGroup={availableAreasInGroup}
    />
  );
}
