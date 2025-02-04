import { SearchResults } from '@/components/pages/results';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';
import { connection } from 'next/server';
import { ErrorPage } from '@/components/pages/error';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import {
  Area,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';

const determineSelectedAreaType = (
  selectedAreaType?: string,
  selectedAreaData?: AreaWithRelations[],
  availableAreaTypes?: AreaType[]
): string | undefined => {
  if (selectedAreaType) return selectedAreaType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].areaType;

  if (availableAreaTypes && availableAreaTypes.length > 0)
    return availableAreaTypes[0].name;
};

const determineGroupType = (
  selectedGroupType?: string,
  selectedAreaData?: AreaWithRelations[]
): string | undefined => {
  if (selectedGroupType) return selectedGroupType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].parent?.areaType;
};

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
  const selectedAreaType = searchParams?.[SearchParams.AreaTypeSelected];
  const selectedGroupType = searchParams?.[SearchParams.GroupTypeSelected];
  const areasSelected = asArray(searchParams?.[SearchParams.AreasSelected]);

  const stateManager = new SearchStateManager({
    [SearchParams.SearchedIndicator]: searchedIndicator,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
  });

  try {
    // Perform async API call using indicator prop
    await connection();
    const areasApi = ApiClientFactory.getAreasApiClient();

    /**
    const availableAreaTypes = await areasApi.getAreaTypes();
    const selectedAreasData =
      areasSelected.length > 0
      ? await Promise.all(
          areasSelected.map((area) => areasApi.getArea({ areaCode: area }))
        )
      : [];
    */

    // When DHSCFT-210 is complete The following try catch can be removed
    // and the line above uncommented as part of DHSCFT-211 to check FE against the API
    let sortedByLevelAreaTypes: AreaType[];
    let selectedAreasData: AreaWithRelations[];
    let availableAreas: Area[] = [];
    let selectedAreaType2: string | undefined;

    try {
      const availableAreaTypes = await areasApi.getAreaTypes();
      sortedByLevelAreaTypes = availableAreaTypes?.sort(
        (a, b) => a.level - b.level
      );
      selectedAreasData = await Promise.all(
        areasSelected.map((area) => areasApi.getArea({ areaCode: area }))
      );

      selectedAreaType2 = determineSelectedAreaType(
        selectedAreaType,
        selectedAreasData,
        sortedByLevelAreaTypes
      );
      if (selectedAreaType2) {
        availableAreas = await areasApi.getAreaTypeMembers({
          areaType: selectedAreaType2,
        });
      }
    } catch (error) {
      console.log(`Error from areasApi ${error}`);
      sortedByLevelAreaTypes = [];
      selectedAreasData = [];
      availableAreas = [];
    }

    const initialState = {
      searchState: JSON.stringify(stateManager.getSearchState()),
      indicatorsSelected,
      message: null,
      errors: {},
    };

    // Perform async API call using indicator prop
    const searchResults =
      await SearchServiceFactory.getIndicatorSearchService().searchWith(
        searchedIndicator
      );

    return (
      <SearchResults
        searchResultsFormState={initialState}
        searchResults={searchResults}
        availableAreaTypes={sortedByLevelAreaTypes}
        availableAreas={availableAreas}
        selectedAreaType={selectedAreaType2}
        selectedGroupType={determineGroupType(
          selectedGroupType,
          selectedAreasData
        )}
        selectedAreas={selectedAreasData}
      />
    );
  } catch (error) {
    // Log error response
    console.log(`Error response received from call: ${error}`);
    return (
      <ErrorPage
        errorText="An error has been returned by the service. Please try again."
        errorLink="/search"
        errorLinkText="Return to Search"
      />
    );
  }
}
