import { GetHealthDataForAnIndicatorInequalitiesEnum } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { HierarchyNameTypes } from '@/lib/areaFilterHelpers/areaType';

import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { PopulationPyramidWithTable } from '@/components/organisms/PopulationPyramidWithTable';
import { getHealthDataForIndicator } from '@/lib/ViewsHelpers';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
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

  const populationIndicatorID: PopulationIndicatorIdsTypes | undefined =
    await (async () => {
      if (areaCodesToRequest.length < 1) {
        return undefined;
      }

      return await fetchPopulationIndicatorID(areaCodesToRequest[0]);
    })();

  const getPopulationData = async (
    populationIndicatorID: PopulationIndicatorIdsTypes
  ) => {
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
  };

  const getPopulationIndicatorMetadata = async (
    populationIndicatorID: PopulationIndicatorIdsTypes
  ) => {
    return await SearchServiceFactory.getIndicatorSearchService().getIndicator(
      populationIndicatorID.toString()
    );
  };

  const { populationData, populationMetadata } = await (async () => {
    if (!populationIndicatorID) {
      return {
        populationData: undefined,
        populationMetadata: undefined,
      };
    }

    const [populationData, populationIndicatorMetadata] = await Promise.all([
      getPopulationData(populationIndicatorID),
      getPopulationIndicatorMetadata(populationIndicatorID),
    ]);

    return { populationData, populationMetadata: populationIndicatorMetadata };
  })();

  return (
    <PopulationPyramidWithTable
      healthDataForAreas={populationData?.areaHealthData ?? []}
      groupAreaSelected={groupAreaSelected}
      searchState={searchState}
      xAxisTitle="Age"
      yAxisTitle="Percentage of total population"
      dataSource={populationMetadata?.dataSource}
    />
  );
};
