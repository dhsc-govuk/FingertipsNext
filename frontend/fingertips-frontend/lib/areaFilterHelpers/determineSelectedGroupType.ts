import { AreaType } from '@/generated-sources/ft-api-client';
import {
  AreaTypeKeys,
  englandAreaType,
} from '@/lib/areaFilterHelpers/areaType';

export const determineSelectedGroupType = (
  selectedGroupType?: AreaTypeKeys,
  availableGroupTypes?: AreaType[]
): AreaTypeKeys => {
  if (selectedGroupType) return selectedGroupType;

  if (availableGroupTypes && availableGroupTypes.length > 0)
    return availableGroupTypes[0].key as AreaTypeKeys;

  return englandAreaType.key as AreaTypeKeys;
};
