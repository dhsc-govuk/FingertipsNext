import { TwoOrMoreIndicatorsAreasViewPlot } from '@/components/viewPlots/TwoOrMoreIndicatorsAreasViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import { getHealthDataForIndicator } from '@/lib/ViewsHelpers';

export default async function TwoOrMoreIndicatorsAreasView({
  searchState,
  selectedIndicatorsData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
  } = stateManager.getSearchState();

  if (!indicatorsSelected || indicatorsSelected.length < 2) {
    throw new Error('invalid indicators selected passed to view');
  }

  if (!areasSelected || areasSelected.length < 1) {
    throw new Error('invalid areas selected passed to view');
  }

  if (
    !selectedIndicatorsData ||
    selectedIndicatorsData.length !== indicatorsSelected.length
  ) {
    throw new Error('invalid indicator metadata passed to view');
  }

  const areaCodesToRequest = [...areasSelected];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }

  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const combinedIndicatorData = await Promise.all(
    indicatorsSelected.map((indicator) => {
      return getHealthDataForIndicator(
        indicatorApi,
        indicator,
        areaCodesToRequest
      );
    })
  );

  const indicatorList = indicatorsSelected.map((indicatorAsAString) => {
    return Number(indicatorAsAString);
  });

  const benchmarkQuartiles = await indicatorApi.indicatorsQuartilesGet(
    {
      indicatorIds: indicatorList,
      areaCode: areasSelected[0],
      ancestorCode: selectedGroupCode ?? areaCodeForEngland,
      areaType: areaTypeSelected,
    },
    API_CACHE_CONFIG
  );

  return (
    <ViewsWrapper
      searchState={searchState}
      indicatorsDataForAreas={combinedIndicatorData}
    >
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={combinedIndicatorData}
        indicatorMetadata={selectedIndicatorsData}
        benchmarkStatistics={benchmarkQuartiles}
        searchState={searchState}
      />
    </ViewsWrapper>
  );
}
