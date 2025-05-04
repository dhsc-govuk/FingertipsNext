'use client';

import { FC, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Area,
  AreaType,
  AreaWithRelations,
} from '@/generated-sources/ft-api-client';
import {
  getAreaTypeMembersUrl,
  getAreaTypesUrl,
  getAreaUrl,
} from '@/components/shallow/queryKeys';
import { determineSelectedGroup } from '@/lib/areaFilterHelpers/determineSelectedGroup';

interface SeedQueryCacheProps {
  children?: ReactNode;
  areaTypes: AreaType[];
  availableArea: AreaWithRelations;
  selectedAreaType: string;
  selectedGroupType?: string;
  selectedGroup?: string;
  groups: Area[];
}
export const SeedQueryCache: FC<SeedQueryCacheProps> = ({
  children,
  areaTypes,
  selectedAreaType,
  selectedGroupType,
  selectedGroup,
  availableArea,
  groups,
}) => {
  const queryClient = useQueryClient();

  // area types request
  const areaTypesSeedUrl = getAreaTypesUrl();
  queryClient.setQueryData([areaTypesSeedUrl], areaTypes);

  // groups
  if (selectedGroupType && groups.length) {
    queryClient.setQueryData(
      [getAreaTypeMembersUrl(selectedGroupType)],
      groups
    );
    console.log('seed', getAreaTypeMembersUrl(selectedGroupType), groups);
  }

  // areas available for checkbox selection
  const determinedSelectedGroup = determineSelectedGroup(selectedGroup, groups);
  const areasSeedUrl = getAreaUrl(
    determinedSelectedGroup,
    true,
    selectedAreaType
  );
  queryClient.setQueryData([areasSeedUrl], availableArea);

  return (
    <div>
      <div>
        <h2>Seed</h2>
        <pre>
          areaTypesSeedUrl: {areaTypesSeedUrl} - AreaType[x{areaTypes.length}]
        </pre>
        <pre>areasSeedUrl: {areasSeedUrl} - AreaWithRelations</pre>
      </div>
      {children}
    </div>
  );
};
