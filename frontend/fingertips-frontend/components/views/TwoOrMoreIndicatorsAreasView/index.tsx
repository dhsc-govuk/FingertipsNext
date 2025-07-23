import { TwoOrMoreIndicatorsAreasViewPlot } from '@/components/viewPlots/TwoOrMoreIndicatorsAreasViewPlots';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';
import {
  determineBenchmarkRefType,
  getHealthDataForIndicator,
} from '@/lib/ViewsHelpers';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';
import { healthDataRequestAreas } from '@/components/charts/SpineChart/helpers/healthDataRequestAreas';
import { SeedDataPromises } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { SeedQueryCache } from '@/components/atoms/SeedQueryCache/SeedQueryCache';
import { seedDataFromPromises } from '@/components/atoms/SeedQueryCache/seedDataFromPromises';

export default async function TwoOrMoreIndicatorsAreasView({
  searchState,
  selectedIndicatorsData,
  availableAreas,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.GroupAreaSelected]: groupAreaSelected,
    [SearchParams.BenchmarkAreaSelected]: benchmarkAreaSelected,
  } = stateManager.getSearchState();

  const areaCodes = determineAreaCodes(
    areasSelected,
    groupAreaSelected,
    availableAreas
  );

  if (!indicatorsSelected || indicatorsSelected.length < 2) {
    throw new Error('invalid indicators selected passed to view');
  }

  if (!areaCodes || areaCodes.length < 1) {
    throw new Error('invalid areas selected passed to view');
  }

  if (!selectedAreaType) {
    throw new Error('selected area type required for view');
  }

  if (
    !selectedIndicatorsData ||
    selectedIndicatorsData.length !== indicatorsSelected.length
  ) {
    throw new Error('invalid indicator metadata passed to view');
  }

  const areasToRequest = healthDataRequestAreas(searchState, availableAreas);

  const benchmarkRefType = determineBenchmarkRefType(benchmarkAreaSelected);
  const areaGroup =
    benchmarkRefType === BenchmarkReferenceType.SubNational
      ? selectedGroupCode
      : undefined;

  await connection();

  const seedPromises: SeedDataPromises = {};

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const combinedIndicatorData = await Promise.all(
    indicatorsSelected.map((indicator) => {
      return getHealthDataForIndicator(
        indicatorApi,
        indicator,
        areasToRequest,
        benchmarkRefType,
        true,
        areaGroup,
        seedPromises
      );
    })
  );

  const seedData = await seedDataFromPromises(seedPromises);

  return (
    <ViewsWrapper
      areaCodes={areaCodes}
      indicatorsDataForAreas={combinedIndicatorData}
    >
      <SeedQueryCache seedData={seedData} />
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={combinedIndicatorData}
        availableAreas={availableAreas}
      />
    </ViewsWrapper>
  );
}
