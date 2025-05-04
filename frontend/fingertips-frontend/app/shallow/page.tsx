import { ShallowNavigation } from '@/components/shallow/ShallowNavigation';
import {
  API_CACHE_CONFIG,
  ApiClientFactory,
} from '@/lib/apiClient/apiClientFactory';

import { SeedQueryCache } from '@/components/shallow/SeedQueryCache';
import { FC } from 'react';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { determineSelectedGroup } from '@/lib/areaFilterHelpers/determineSelectedGroup';

interface ServerSidePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// SERVER SIDE RENDERED
const ServerSidePage: FC<ServerSidePageProps> = async (props) => {
  const searchParams = await props.searchParams;
  const { ats = 'england', gts, gs } = searchParams;

  const areasApi = ApiClientFactory.getAreasApiClient();

  // area types
  const areaTypes = await areasApi.getAreaTypes({}, API_CACHE_CONFIG);

  // groups
  const groups = gts
    ? await areasApi.getAreaTypeMembers({ areaTypeKey: gts as string })
    : [];

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

  return (
    <SeedQueryCache
      areaTypes={areaTypes}
      availableArea={availableArea}
      selectedAreaType={(ats as string) ?? 'england'}
      selectedGroupType={gts as string}
      selectedGroup={gs as string}
      groups={groups}
    >
      <ShallowNavigation />
    </SeedQueryCache>
  );
};

export default ServerSidePage;
