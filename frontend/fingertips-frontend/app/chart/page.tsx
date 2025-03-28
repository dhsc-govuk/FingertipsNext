import { connection } from 'next/server';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';

import { ViewsContext } from '@/components/views/ViewsContext';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';
import { ErrorPage } from '@/components/pages/error';
import { PopulationPyramidWithTable } from '@/components/organisms/PopulationPyramidWithTable';
import { PyramidContextProvider } from './PyramidContextProvider';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  try {
    const searchParams = await props.searchParams;
    const stateManager = SearchStateManager.initialise(searchParams);
    const {
      [SearchParams.AreasSelected]: areaCodes,
      [SearchParams.IndicatorsSelected]: indicatorsSelected,
    } = stateManager.getSearchState();

    const areasSelected = areaCodes ?? [];

    // We don't want to render this page statically
    await connection();

    const selectedIndicatorsData =
      indicatorsSelected && indicatorsSelected.length > 0
        ? (
            await Promise.all(
              indicatorsSelected.map((indicator) =>
                SearchServiceFactory.getIndicatorSearchService().getIndicator(
                  indicator
                )
              )
            )
          ).filter((indicatorDocument) => indicatorDocument !== undefined)
        : [];
    const areasApi = ApiClientFactory.getAreasApiClient();

    const selectedAreasData =
      areasSelected && areasSelected.length > 0
        ? await Promise.all(
            areasSelected.map((area) =>
              areasApi.getArea({ areaCode: area }, API_CACHE_CONFIG)
            )
          )
        : [];

    const {
      availableAreaTypes,
      availableAreas,
      availableGroupTypes,
      availableGroups,
      updatedSearchState,
    } = await getAreaFilterData(
      stateManager.getSearchState(),
      selectedAreasData
    );

    if (updatedSearchState) {
      stateManager.setState(updatedSearchState);
    }

    return (
      <>
        <ViewsContext
          searchState={stateManager.getSearchState()}
          selectedAreasData={selectedAreasData}
          selectedIndicatorsData={selectedIndicatorsData}
          areaFilterData={{
            availableAreaTypes,
            availableGroupTypes,
            availableGroups,
            availableAreas,
          }}
        />

        <PyramidContextProvider
          areaCodes={areasSelected}
          searchState={stateManager.getSearchState()}
        />
      </>
    );
  } catch (error) {
    console.log(`Error response received from call: ${error}`);
    return <ErrorPage />;
  }
}
