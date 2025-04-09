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

import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { PopulationPyramidWithTable } from '@/components/organisms/PopulationPyramidWithTable';
import { fetchIndicatorWithHealthDataForAreaInBatches } from '@/lib/ViewsHelpers';
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

  const populationDataForArea: IndicatorWithHealthDataForArea | undefined =
    await (async () => {
      if (areaCodesToRequest.length == 0) {
        return undefined;
      }
      const populationIndicatorID = await fetchPopulationIndicatorID(
        areaCodesToRequest[0]
      );
      return await fetchIndicatorWithHealthDataForAreaInBatches(
        populationIndicatorID,
        areaCodesToRequest,
        [
          GetHealthDataForAnIndicatorInequalitiesEnum.Age,
          GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
        ]
      );
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
