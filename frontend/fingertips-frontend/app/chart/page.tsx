import { Chart } from '@/components/pages/chart';
import { connection } from 'next/server';
import {
  PopulationData,
  preparePopulationData,
} from '@/lib/chartHelpers/preparePopulationData';
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
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';

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
  const selectedGroupType = searchParams?.[SearchParams.GroupTypeSelected];

  // We don't want to render this page statically
  await connection();

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const areaApi = ApiClientFactory.getAreasApiClient();

  const parentAreaCodeIsNeeded =
    indicatorsSelected.length === 1 &&
    areaCodes.length <= 2 &&
    selectedGroupType != englandAreaType.key;
  let parentAreaCode: string | undefined;
  if (parentAreaCodeIsNeeded) {
    try {
      const areaData = await areaApi.getArea({ areaCode: areaCodes[0] }); // DHSCFT-256 assumes one common parent
      parentAreaCode = areaData?.parent?.code;
    } catch (error) {
      console.log('error getting area data ', error);
    }
  }

  const areaCodesToRequest = parentAreaCode
    ? [...areaCodes, areaCodeForEngland, parentAreaCode]
    : [...areaCodes, areaCodeForEngland];

  const healthIndicatorData = await Promise.all(
    indicatorsSelected.map((indicatorId) =>
      indicatorApi.getHealthDataForAnIndicator({
        indicatorId: Number(indicatorId),
        areaCodes: areaCodesToRequest,
      })
    )
  );

  let rawPopulationData: HealthDataForArea[] | undefined;
  try {
    rawPopulationData = await indicatorApi.getHealthDataForAnIndicator({
      indicatorId: indicatorIdForPopulation,
      areaCodes: [...areaCodes, areaCodeForEngland],
    });
  } catch (error) {
    console.log('error getting population data ', error);
  }

  // Passing the first two area codes until business logic to select baseline comparator for pop pyramids is added
  const preparedPopulationData: PopulationData | undefined = rawPopulationData
    ? preparePopulationData(rawPopulationData, areaCodes[0], areaCodes[1])
    : undefined;

  // only checking for selectedAreaType, single indicator and two or more areas until business logic to also confirm when an entire Group of areas has been selected is in place
  const mapDataIsRequired =
    selectedAreaType &&
    indicatorsSelected.length === 1 &&
    areaCodes.length >= 2;

  const mapData = mapDataIsRequired
    ? getMapData(selectedAreaType as AreaTypeKeysForMapMeta, areaCodes)
    : undefined;

  return (
    <Chart
      populationData={preparedPopulationData}
      healthIndicatorData={healthIndicatorData}
      parentAreaCode={parentAreaCode}
      mapData={mapData}
      searchedIndicator={searchedIndicator}
      indicatorsSelected={indicatorsSelected}
      areasSelected={areaCodes}
    />
  );
}
