import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

import { AreaFilterData } from '../molecules/SelectAreasFilterPanel';
import { ChartPageWrapper } from '../pages/chartPageWrapper';
import {
  Area,
  AreaWithRelations,
  GetHealthDataForAnIndicatorInequalitiesEnum,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { ViewsSelector } from './ViewsSelector';
import { PopulationPyramidWithTable } from '../organisms/PopulationPyramidWithTable';
import { HierarchyNameTypes } from '@/lib/areaFilterHelpers/areaType';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';

const enum PopulationIndicatorIdsTypes {
  ADMINISTRATIVE = 92708,
  NHS = 337,
}
export type ViewProps = {
  searchState: SearchStateParams;
  areaFilterData?: AreaFilterData;
  selectedAreasData?: AreaWithRelations[];
  selectedIndicatorsData?: IndicatorDocument[];
};

const determineAreaCodes = (
  groupAreaSelected?: string,
  areaSelected?: string[],
  availableAreas?: Area[]
): string[] => {
  if (groupAreaSelected === ALL_AREAS_SELECTED) {
    return (
      availableAreas?.map((area) => {
        return area.code;
      }) ?? []
    );
  }

  if (!areaSelected || areaSelected.length === 0) {
    return [areaCodeForEngland];
  }

  return areaSelected ?? [];
};

export async function ViewsContext({
  searchState,
  areaFilterData,
  selectedAreasData,
  selectedIndicatorsData,
}: Readonly<ViewProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupAreaSelected]: groupAreaSelected
  } = stateManager.getSearchState();
  const indicators = indicatorsSelected ?? [];

  const areaCodes = determineAreaCodes(
    groupAreaSelected,
    areasSelected,
    areaFilterData?.availableAreas
  );

  const areaCodesToRequest = (() => {
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
    <ChartPageWrapper
      key={JSON.stringify(searchState)}
      searchState={searchState}
      areaFilterData={areaFilterData}
      selectedAreasData={selectedAreasData}
      selectedIndicatorsData={selectedIndicatorsData}
    >
      <>
        <ViewsSelector
          areaCodes={areaCodes}
          indicators={indicators}
          searchState={searchState}
          selectedIndicatorsData={selectedIndicatorsData}
        />

        <PopulationPyramidWithTable
          healthDataForAreas={indicatorPopulationData?.areaHealthData ?? []}
          xAxisTitle="Age"
          yAxisTitle="Percentage of total population"
          searchState={searchState}
        />
      </>
    </ChartPageWrapper>
  );
}
