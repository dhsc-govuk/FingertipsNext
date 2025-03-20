import { OneIndicatorOneAreaViewPlots } from '@/components/viewPlots/OneIndicatorOneAreaViewPlots';
import {
  GetHealthDataForAnIndicatorComparisonMethodEnum,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { connection } from 'next/server';
import { ViewProps } from '../ViewsContext';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { HierarchyNameTypes } from '@/lib/areaFilterHelpers/areaType';

const enum IndicationPopulationTypes {
  ADMINISTRATIVE = 92708,
  NHS = 337,
}

export default async function OneIndicatorOneAreaView({
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
  if (selectedGroupCode && selectedGroupCode != areaCodeForEngland) {
    areaCodesToRequest.push(selectedGroupCode);
  }

  await connection();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const areasApi = ApiClientFactory.getAreasApiClient();

  let healthIndicatorData: HealthDataForArea[] | undefined;
  try {
    healthIndicatorData = await indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: Number(indicatorSelected[0]),
        areaCodes: areaCodesToRequest,
        comparisonMethod: GetHealthDataForAnIndicatorComparisonMethodEnum.Rag,
      },
      API_CACHE_CONFIG
    );
  } catch (error) {
    console.error('error getting health indicator data for area', error);
    throw new Error('error getting health indicator data for area');
  }

  let indicatorMetadata: IndicatorDocument | undefined;
  try {
    indicatorMetadata =
      await SearchServiceFactory.getIndicatorSearchService().getIndicator(
        indicatorSelected[0]
      );
  } catch (error) {
    console.error(
      'error getting meta data for health indicator for area',
      error
    );
  }

  const healthPopulationData = await (async () => {
    try {
      const populationIndicatorID: number = await (async (areaCode: string) => {
        const area = await areasApi.getArea({ areaCode: areaCode });
        if (area.areaType.hierarchyName == HierarchyNameTypes.NHS) {
          return IndicationPopulationTypes.NHS;
        }
        return IndicationPopulationTypes.ADMINISTRATIVE;
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
      console.error('error getting health indicator data for area', error);
    }
  })();

  return (
    <OneIndicatorOneAreaViewPlots
      healthPopulationData={healthPopulationData}
      healthIndicatorData={healthIndicatorData}
      searchState={searchState}
      indicatorMetadata={indicatorMetadata}
    />
  );
}
