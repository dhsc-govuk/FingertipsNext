'use client';

import { FC, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Area,
  AreaType,
  AreaWithRelations,
  GetHealthDataForAnIndicatorInequalitiesEnum,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  getAreaTypeMembersUrl,
  getAreaTypesUrl,
  getAreaUrl,
  getHealthDataForAnIndicatorUrl,
} from '@/components/shallow/apiUrls';
import { determineSelectedGroup } from '@/lib/areaFilterHelpers/determineSelectedGroup';

interface SeedQueryCacheProps {
  children?: ReactNode;
  areaTypes: AreaType[];
  availableArea: AreaWithRelations;
  selectedAreaType: string;
  selectedGroupType?: string;
  selectedGroup?: string;
  groups: Area[];
  indicatorData?: IndicatorWithHealthDataForArea;
  selectedAreas: string[];
}
export const SeedQueryCache: FC<SeedQueryCacheProps> = ({
  children,
  areaTypes,
  selectedAreaType,
  selectedGroupType,
  selectedGroup,
  availableArea,
  groups,
  selectedAreas,
  indicatorData,
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
  }

  // areas available for checkbox selection
  const determinedSelectedGroup = determineSelectedGroup(selectedGroup, groups);
  const areasSeedUrl = getAreaUrl(
    determinedSelectedGroup,
    true,
    selectedAreaType
  );
  queryClient.setQueryData([areasSeedUrl], availableArea);

  // health data
  if (indicatorData && selectedAreas?.length) {
    const indicatorDataSeedUrl = getHealthDataForAnIndicatorUrl(41101, {
      areaCodes: selectedAreas,
      areaType: selectedAreaType,
      inequalities: [
        GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
        GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
      ],
    });
    queryClient.setQueryData([indicatorDataSeedUrl], indicatorData);
  }

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
