import { SearchResults } from '@/components/pages/search/results';
import {
  getAreaData,
  getAvailableAreasInGroup,
  getAvailableGroups,
  getAvailableGroupTypes,
  getSearchData,
} from './search-result-data';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
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
  const areasSelected = asArray(searchParams?.[SearchParams.AreasSelected]);

  // Perform async API call using indicator prop
  const searchResults = getSearchData();
  const selectedAreaCodesData = areasSelected.map((areaSelected) =>
    getAreaData(areaSelected)
  );
  // const selectedAreaCodeData = getAreaData(searchedAreaCode);
  const availableGroupTypes = getAvailableGroupTypes(
    selectedAreaCodesData[0].groupType
  );
  const availableGroups = getAvailableGroups(selectedAreaCodesData[0].group);
  const availableAreasInGroup = getAvailableAreasInGroup(
    selectedAreaCodesData[0].group
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
      selectedAreaCodesData={selectedAreaCodesData}
      availableGroupTypes={availableGroupTypes}
      availableGroups={availableGroups}
      availableAreasInGroup={availableAreasInGroup}
    />
  );
}
