import {
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { HierarchyNameTypes } from '@/lib/areaFilterHelpers/areaType';

import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { PopulationPyramidWithTable } from '@/components/organisms/PopulationPyramidWithTable';
import { chunkArray } from '@/lib/ViewsHelpers';
const enum PopulationIndicatorIdsTypes {
  ADMINISTRATIVE = 92708,
  NHS = 337,
}

const fetchPopulationIndicatorID = async (areaCode: string) => {
  const areasApi = ApiClientFactory.getAreasApiClient();
  const area = await areasApi.getArea({ areaCode: areaCode });
  if (area.areaType.hierarchyName == HierarchyNameTypes.NHS) {
    return PopulationIndicatorIdsTypes.NHS;
  }
  return PopulationIndicatorIdsTypes.ADMINISTRATIVE;
};
interface PyramidContextProviderProps {
  areaCodes: string[];
  searchState: SearchStateParams;
}

export const PopulationPyramidWithTableDataProvider = async ({
  areaCodes,
  searchState,
}: PyramidContextProviderProps) => {
  const stateManager = SearchStateManager.initialise(searchState);

  const { [SearchParams.GroupSelected]: groupAreaSelected } =
    stateManager.getSearchState();

  const areaCodesToRequest = (() => {
    if (areaCodes.length == 0) {
      return [];
    }
    const areaCodesToRequest = [...areaCodes];
    if (!areaCodesToRequest.includes(areaCodeForEngland)) {
      areaCodesToRequest.push(areaCodeForEngland);
    }
    if (groupAreaSelected && groupAreaSelected != areaCodeForEngland) {
      areaCodesToRequest.push(groupAreaSelected);
    }
    return areaCodesToRequest;
  })();

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const populationDataForArea: IndicatorWithHealthDataForArea | undefined =
    await (async () => {
      try {
        if (areaCodesToRequest.length == 0) {
          return undefined;
        }
        let indicatorWithData: IndicatorWithHealthDataForArea | undefined =
          undefined;
        const populationIndicatorID = await fetchPopulationIndicatorID(
          areaCodesToRequest[0]
        );

        chunkArray(areaCodesToRequest).forEach(
          async (requestAreas: string[]) => {
            try {
              const fetchedIndicatorWithData =
                await indicatorApi.getHealthDataForAnIndicator(
                  {
                    indicatorId: populationIndicatorID,
                    areaCodes: requestAreas,
                    inequalities: [
                      GetHealthDataForAnIndicatorInequalitiesEnum.Age,
                      GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
                    ],
                  },
                  API_CACHE_CONFIG
                );

              //append the new data to the list of areas
              if (!indicatorWithData) {
                indicatorWithData = fetchedIndicatorWithData;
                return;
              }
              indicatorWithData?.areaHealthData?.push(
                ...(fetchedIndicatorWithData.areaHealthData ?? [])
              );
            } catch (error) {
              console.error(
                'error getting population health indicator data for area',
                error
              );
            }
          }
        );

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
    <PopulationPyramidWithTable
      healthDataForAreas={populationDataForArea?.areaHealthData ?? []}
      groupAreaSelected={groupAreaSelected}
      searchState={searchState}
      xAxisTitle="Age"
      yAxisTitle="Percentage of total population"
    />
  );
};
