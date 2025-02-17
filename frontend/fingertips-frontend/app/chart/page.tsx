import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import { preparePopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { asArray } from '@/lib/pageHelpers';
import {
  areaCodeForEngland,
  indicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import {
  AreaTypeKeysForMapMeta,
  getMapData,
} from '@/lib/thematicMapUtils/getMapData';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';

export default async function ChartPage(
  props: Readonly<{
    searchParams?: Promise<SearchStateParams>;
  }>
) {
  const searchParams = await props.searchParams;
  const searchedIndicator = searchParams?.[SearchParams.SearchedIndicator];
  const indicatorsSelected = asArray(
    searchParams?.[SearchParams.IndicatorsSelected]
  );
  const areaCodes = asArray(searchParams?.[SearchParams.AreasSelected]);
  const selectedAreaType = searchParams?.[SearchParams.AreaTypeSelected];

  // We don't want to render this page statically
  await connection();

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const areaApi = ApiClientFactory.getAreasApiClient();

  let areaData: AreaWithRelations | undefined;
  if (areaCodes.length === 1) {
    // DHSCFT-256 assumes one parent.

    try {
      areaData = await areaApi.getArea({ areaCode: areaCodes[0] });
    } catch (error) {
      console.log('error getting area data ', error);
    }
  }

  let areaCodesToRequest = [...areaCodes, areaCodeForEngland];
  if (areaData?.parent) {
    areaCodesToRequest = [...areaCodesToRequest, areaData.parent.code];
  }

  const healthIndicatorData = await Promise.all(
    indicatorsSelected.map((indicatorId) =>
      indicatorApi.getHealthDataForAnIndicator({
        indicatorId: Number(indicatorId),
        areaCodes: areaCodesToRequest,
      })
    )
  );

  let rawPopulationData;
  let preparedPopulationData;
  try {
    rawPopulationData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: indicatorIdForPopulation,
      areaCodes: [...areaCodes, areaCodeForEngland],
    });
  } catch (error) {
    console.log('error getting population data ', error);
  }

  if (rawPopulationData) {
    preparedPopulationData = preparePopulationData(
      rawPopulationData,
      areaCodes[0],
      areaCodes[1] // Passing the first two area codes until business logic to select baseline comparator for pop pyramids is added
    );
  }

  let mapData;
  if (
    selectedAreaType &&
    indicatorsSelected.length === 1 &&
    areaCodes.length >= 2
  ) {
    // only checking for selectedAreaType, single indicator and two or more areas until business logic to also confirm when an entire Group of areas has been selected is in place
    mapData = getMapData(selectedAreaType as AreaTypeKeysForMapMeta, areaCodes);
  }

  return (
    <Chart
      populationData={preparedPopulationData}
      healthIndicatorData={healthIndicatorData}
      mapData={mapData}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
      areasSelected={areaCodes}
    />
  );
}
