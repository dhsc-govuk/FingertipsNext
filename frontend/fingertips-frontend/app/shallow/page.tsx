import { ShallowPage } from '@/components/shallow/ShallowPage';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';
import { SeedQueryCache } from '@/components/shallow/seedQueryCache/SeedQueryCache';
import { FC } from 'react';
import {
  Area,
  GetHealthDataForAnIndicatorInequalitiesEnum,
} from '@/generated-sources/ft-api-client';
import { determineSelectedGroup } from '@/lib/areaFilterHelpers/determineSelectedGroup';
import {
  getAreaTypeMembersUrl,
  getAreaTypesUrl,
  getAreaUrl,
  getHealthDataForAnIndicatorUrl,
  HealthDataForAnIndicatorUrlOptions,
} from '@/components/shallow/apiUrls';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SeedData } from '@/components/shallow/seedQueryCache/seedQueryCache.types';

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

const areasApi = ApiClientFactory.getAreasApiClient();
const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

// SERVER SIDE RENDERED
const ServerSidePage: FC<ServerSidePageProps> = async (props) => {
  const searchParams = await props.searchParams;
  const { ats = 'england', gts, gs } = searchParams;
  const selectedAreas = getSearchParamAsArray(searchParams, 'as');
  const selectedAreasWithEngland = [
    ...new Set([...selectedAreas, areaCodeForEngland]),
  ];

  const seedData: SeedData = {};

  // area types
  const areaTypesSeedUrl = getAreaTypesUrl();
  seedData[areaTypesSeedUrl] = await areasApi.getAreaTypes(
    {},
    API_CACHE_CONFIG
  );

  // groups
  let groups: Area[] = [];
  if (gts) {
    const groupsUrl = getAreaTypeMembersUrl(gts as string);
    groups = await areasApi.getAreaTypeMembers({
      areaTypeKey: gts as string,
    });
    seedData[groupsUrl] = groups;
  }

  // areas
  const determinedSelectedGroup = determineSelectedGroup(gs as string, groups);
  const areasParams = {
    areaCode: determinedSelectedGroup,
    includeChildren: true,
    childAreaType: ats as string,
  };
  const areasSeedUrl = getAreaUrl(areasParams);
  seedData[areasSeedUrl] = await areasApi.getArea(
    areasParams,
    API_CACHE_CONFIG
  );

  // healthdata
  const indicatorParams: HealthDataForAnIndicatorUrlOptions = {
    areaCodes: selectedAreasWithEngland,
    areaType: ats as string,
  };

  if (selectedAreas.length >= 2) {
    indicatorParams.includeEmptyAreas = true;
    indicatorParams.latestOnly = selectedAreas.length > 2;
  } else {
    indicatorParams.inequalities = [
      GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
      GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
    ];
  }

  const indicatorDataSeedUrl = getHealthDataForAnIndicatorUrl(
    41101,
    indicatorParams
  );
  seedData[indicatorDataSeedUrl] =
    await indicatorApi.getHealthDataForAnIndicator(
      { indicatorId: 41101, ...indicatorParams },
      API_CACHE_CONFIG
    );

  return (
    <SeedQueryCache seedData={seedData}>
      <ShallowPage />
    </SeedQueryCache>
  );
};

export default ServerSidePage;
