import { GetHealthDataForAnIndicatorInequalitiesEnum } from '@/generated-sources/ft-api-client';
import {
  administratorIndicatorID,
  areaCodeForEngland,
  nhsIndicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  allAreaTypes,
  HierarchyNameTypes,
} from '@/lib/areaFilterHelpers/areaType';

import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { PopulationPyramidWithTable } from '@/components/organisms/PopulationPyramidWithTable';
import { getHealthDataForIndicator } from '@/lib/ViewsHelpers';

const getPopulationData = (
  populationIndicatorID: number,
  areaCodesToRequest: string[]
) => {
  return getHealthDataForIndicator(
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

interface PyramidContextProviderProps {
  areaCodes: string[];
  searchState: SearchStateParams;
}

export const PopulationPyramidWithTableDataProvider = async ({
  areaCodes,
  searchState,
}: PyramidContextProviderProps) => {
  const {
    [SearchParams.GroupSelected]: groupAreaSelected,
    [SearchParams.AreaTypeSelected]: areaTypeSelected,
  } = searchState;

  const areaCodesToRequest = [...areaCodes];
  if (!areaCodesToRequest.includes(areaCodeForEngland)) {
    areaCodesToRequest.push(areaCodeForEngland);
  }
  if (groupAreaSelected && groupAreaSelected != areaCodeForEngland) {
    areaCodesToRequest.push(groupAreaSelected);
  }

  const hierarchyName = allAreaTypes.find(
    (areaType) => areaType.key === areaTypeSelected
  );

  const populationIndicatorID =
    hierarchyName?.hierarchyName === HierarchyNameTypes.NHS
      ? nhsIndicatorIdForPopulation
      : administratorIndicatorID;

  const populationData = await getPopulationData(
    populationIndicatorID,
    areaCodesToRequest
  );

  return (
    <PopulationPyramidWithTable
      healthDataForAreas={populationData?.areaHealthData ?? []}
      searchState={searchState}
      xAxisTitle="Age"
      yAxisTitle="Percentage of total population"
    />
  );
};
