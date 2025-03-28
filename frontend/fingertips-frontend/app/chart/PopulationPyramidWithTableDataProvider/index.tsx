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
const enum PopulationIndicatorIdsTypes {
  ADMINISTRATIVE = 92708,
  NHS = 337,
}

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

  const areasApi = ApiClientFactory.getAreasApiClient();
  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
  const populationDataForArea: IndicatorWithHealthDataForArea | undefined =
    await (async () => {
      try {
        if (areaCodesToRequest.length == 0) {
          return undefined;
        }

        const populationIndicatorID: number = await (async (
          areaCode: string
        ) => {
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
    <PopulationPyramidWithTable
      healthDataForAreas={populationDataForArea?.areaHealthData ?? []}
      groupAreaSelected={groupAreaSelected}
      searchState={searchState}
      xAxisTitle="Age"
      yAxisTitle="Population"
    />
  );
};
