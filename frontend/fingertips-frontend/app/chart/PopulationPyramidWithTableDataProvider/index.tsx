import {
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  administratorIndicatorID,
  areaCodeForEngland,
  nhsIndicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
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
import { getHealthDataForIndicator } from '@/lib/ViewsHelpers';

const getAreaCodeMappingsToIndicatorIds = async (
  areaCodesToRequest: string[]
) => {
  const areasApi = ApiClientFactory.getAreasApiClient();
  const mappings: Record<string, number> = {};

  await Promise.all(
    areaCodesToRequest.map(async (areaCode) => {
      const area = await areasApi.getArea(
        { areaCode: areaCode },
        API_CACHE_CONFIG
      );
      const indicatorTypeID =
        area.areaType.hierarchyName == HierarchyNameTypes.NHS
          ? nhsIndicatorIdForPopulation
          : administratorIndicatorID;
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

  const areaTypeCodeMappings =
    await getAreaCodeMappingsToIndicatorIds(areaCodesToRequest);

  const populationDataForArea: IndicatorWithHealthDataForArea | undefined =
    await (async () => {
      if (areaCodesToRequest.length < 1) {
        return undefined;
      }

      const populationIndicatorID = areaTypeCodeMappings[areaCodesToRequest[0]];

      return await getHealthDataForIndicator(
        ApiClientFactory.getIndicatorsApiClient(),
        populationIndicatorID,
        [
          {
            areaCodes: areaCodesToRequest,
            inequalities: [
              GetHealthDataForAnIndicatorInequalitiesEnum.Age,
              GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
            ],
          },
        ]
      );
    })();

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
