import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';

export const determineSelectedGroupType = (
  selectedGroupType?: AreaTypeKeys,
  selectedAreaData?: AreaWithRelations[]
): AreaTypeKeys | undefined => {
  if (selectedGroupType) return selectedGroupType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].parent?.areaType.key as AreaTypeKeys;
};
