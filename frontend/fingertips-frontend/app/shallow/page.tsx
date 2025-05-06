import { ShallowNavigation } from '@/components/shallow/ShallowNavigation';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';

import { SeedQueryCache } from '@/components/shallow/SeedQueryCache';
import { FC } from 'react';
import {
  AreaWithRelations,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { determineSelectedGroup } from '@/lib/areaFilterHelpers/determineSelectedGroup';

type SearchParamObj = { [key: string]: string | string[] | undefined };

interface ServerSidePageProps {
  searchParams: Promise<SearchParamObj>;
}

const getSearchParamAsArray = (
  searchObj: SearchParamObj,
  key: keyof SearchParamObj
) => {
  const values = searchObj[key as keyof SearchParamObj];
  if (!values) return [];
  return Array.isArray(values) ? values : [values];
};

// SERVER SIDE RENDERED
const ServerSidePage: FC<ServerSidePageProps> = async (props) => {
  const searchParams = await props.searchParams;
  const { ats = 'england', gts, gs } = searchParams;
  const selectedAreas = getSearchParamAsArray(searchParams, 'as');

  const areasApi = ApiClientFactory.getAreasApiClient();

  // area types
  const areaTypes = await areasApi.getAreaTypes({}, API_CACHE_CONFIG);

  // groups
  const groupsUnsorted = gts
    ? await areasApi.getAreaTypeMembers({ areaTypeKey: gts as string })
    : [];
  const groups = groupsUnsorted?.toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  // areas
  const determinedSelectedGroup = determineSelectedGroup(gs as string, groups);
  const availableArea: AreaWithRelations = await areasApi.getArea(
    {
      areaCode: determinedSelectedGroup,
      includeChildren: true,
      childAreaType: ats as string,
    },
    API_CACHE_CONFIG
  );

  // healthdata
  let indicatorData: IndicatorWithHealthDataForArea | undefined;
  if (selectedAreas.length) {
    const indicatorApi = ApiClientFactory.getIndicatorsApiClient();
    indicatorData = await indicatorApi.getHealthDataForAnIndicator(
      {
        indicatorId: 41101,
        areaCodes: selectedAreas,
        inequalities: [
          GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
          GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
        ],
        areaType: ats as string,
      },
      API_CACHE_CONFIG
    );
  }

  return (
    <SeedQueryCache
      areaTypes={areaTypes}
      availableArea={availableArea}
      selectedAreaType={(ats as string) ?? 'england'}
      selectedGroupType={gts as string}
      selectedGroup={determinedSelectedGroup as string}
      groups={groups}
      selectedAreas={selectedAreas}
      indicatorData={indicatorData}
    >
      <ShallowNavigation />
    </SeedQueryCache>
  );
};

export default ServerSidePage;
