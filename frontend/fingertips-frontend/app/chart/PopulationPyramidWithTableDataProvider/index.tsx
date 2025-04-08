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
import {
  PopulationPyramidWithTable,
  NHSIndicatorID,
  AdministratorIndicatorID,
} from '@/components/organisms/PopulationPyramidWithTable';

//get the mappings of all the areaType to the indicator
const getAreaCodeMappingsToIndicatorIds = async (
  areaCodesToRequest: string[]
) => {
  const areasApi = ApiClientFactory.getAreasApiClient();
  const mappings: Record<string, number> = {};

  await Promise.all(
    areaCodesToRequest.map(async (areaCode) => {
      const area = await areasApi.getArea({ areaCode: areaCode });
      const indicatorTypeID =
        area.areaType.hierarchyName == HierarchyNameTypes.NHS
          ? NHSIndicatorID
          : AdministratorIndicatorID;

      console.log(`Area Code = ${area.code} to ${AdministratorIndicatorID}`);
      mappings[area.code] = indicatorTypeID;
    })
  );

  return mappings;
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

  const areaTypeCodeMappings =
    await getAreaCodeMappingsToIndicatorIds(areaCodesToRequest);

  const populationDataForArea: IndicatorWithHealthDataForArea | undefined =
    await (async () => {
      try {
        if (areaCodesToRequest.length == 0) {
          return undefined;
        }
        const populationIndicatorID: number =
          areaTypeCodeMappings[areaCodesToRequest[0]];
        if (!populationIndicatorID) return undefined;

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

  console.log(areaTypeCodeMappings);
  return (
    <PopulationPyramidWithTable
      healthDataForAreas={populationDataForArea?.areaHealthData ?? []}
      groupAreaSelected={groupAreaSelected}
      searchState={searchState}
      areaCodesMappingToIndicatorIds={areaTypeCodeMappings}
      xAxisTitle="Age"
      yAxisTitle="Percentage of total population"
    />
  );
};
