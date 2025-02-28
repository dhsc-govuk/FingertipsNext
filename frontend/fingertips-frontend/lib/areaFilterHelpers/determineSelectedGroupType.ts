import {
  AreaTypeKeys,
  englandAreaType,
} from '@/lib/areaFilterHelpers/areaType';

export const determineSelectedGroupType = (
  selectedGroupType?: AreaTypeKeys
): AreaTypeKeys => {
  if (selectedGroupType) return selectedGroupType;

  return englandAreaType.key as AreaTypeKeys;
};
