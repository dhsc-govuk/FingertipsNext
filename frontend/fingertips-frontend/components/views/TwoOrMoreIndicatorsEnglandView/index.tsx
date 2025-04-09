import { TwoOrMoreIndicatorsEnglandViewPlots } from '@/components/viewPlots/TwoOrMoreIndicatorsEnglandViewPlots';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

import { getHealthDataForIndicator } from '@/lib/ViewsHelpers';

export default async function TwoOrMoreIndicatorsEnglandView({
  searchState,
  selectedIndicatorsData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  } = stateManager.getSearchState();

  if (
    !indicatorsSelected ||
    indicatorsSelected?.length < 2 ||
    (areasSelected?.length !== 1 && areasSelected?.[0] !== areaCodeForEngland)
  ) {
    throw new Error('Invalid parameters provided to view');
  }

  if (
    !selectedIndicatorsData ||
    selectedIndicatorsData.length !== indicatorsSelected.length
  ) {
    throw new Error('invalid indicator metadata passed to view');
  }

  await connection();

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  const combinedIndicatorData = await Promise.all(
    indicatorsSelected.map((indicator) => {
      return getHealthDataForIndicator(indicatorApi, indicator, [
        areaCodeForEngland,
      ]);
    })
  );

  return (
    <ViewsWrapper
      searchState={searchState}
      indicatorsDataForAreas={combinedIndicatorData}
    >
      <TwoOrMoreIndicatorsEnglandViewPlots
        indicatorData={combinedIndicatorData}
        searchState={searchState}
        indicatorMetadata={selectedIndicatorsData}
      />
    </ViewsWrapper>
  );
}
