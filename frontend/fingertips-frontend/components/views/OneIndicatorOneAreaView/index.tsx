import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import {
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { HierarchyNameTypes } from '@/lib/areaFilterHelpers/areaType';
import { ViewsWrapper } from '@/components/organisms/ViewsWrapper';

const enum PopulationIndicatorIdsTypes {
  ADMINISTRATIVE = 92708,
  NHS = 337,
}

export default async function OneIndicatorOneAreaView({
  selectedIndicatorsData,
  searchState,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.IndicatorsSelected]: indicatorSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
  } = stateManager.getSearchState();

  if (areasSelected?.length !== 1 || indicatorSelected?.length !== 1) {
    throw new Error('Invalid parameters provided to view');
  }

  const areaCodesToRequest = [...areasSelected];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }
  if (selectedGroupCode && selectedGroupCode !== areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  let indicatorData: IndicatorWithHealthDataForArea | undefined;
  try {
    indicatorData = await indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: Number(indicatorSelected[0]),
        areaCodes: areaCodesToRequest,
        inequalities: [
          GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
          GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
        ],
      },
      API_CACHE_CONFIG
    );
  } catch (error) {
    console.error('error getting health indicator data for area', error);
    throw new Error('error getting health indicator data for area');
  }

  const areasApi = ApiClientFactory.getAreasApiClient();
  const indicatorPopulationData = await (async () => {
    try {
      const populationIndicatorID: number = await (async (areaCode: string) => {
        const area = await areasApi.getArea({ areaCode: areaCode });
        if (area.areaType.hierarchyName == HierarchyNameTypes.NHS) {
          return PopulationIndicatorIdsTypes.NHS;
        }
        return PopulationIndicatorIdsTypes.ADMINISTRATIVE;
      })(areaCodesToRequest[0]);

      return await indicatorApi.getHealthDataForAnIndicator(
        {
          indicatorId: populationIndicatorID,
          areaCodes: areaCodesToRequest,
          inequalities: [
            GetHealthDataForAnIndicatorInequalitiesEnum.Age,
            GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
          ],
        },
        API_CACHE_CONFIG
      );
    } catch (error) {
      console.error(
        'error getting population health indicator data for area',
        error
      );
    }
  })();

  return (
    <ViewsWrapper
      searchState={searchState}
      indicatorsDataForAreas={[indicatorData]}
    >
      <OneIndicatorOneAreaViewPlots
        populationHealthDataForArea={indicatorPopulationData?.areaHealthData}
        indicatorData={indicatorData}
        searchState={searchState}
        indicatorMetadata={selectedIndicatorsData?.[0]}
      />
    </ViewsWrapper>
  );
}
