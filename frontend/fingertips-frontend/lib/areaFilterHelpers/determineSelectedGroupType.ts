import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';

export const determineSelectedGroupType = (
  selectedGroupType?: AreaTypeKeys
): AreaTypeKeys => {
  if (selectedGroupType) return selectedGroupType;

  return 'england';
};
