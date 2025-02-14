import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';

export const determineSelectedAreaType = (
  selectedAreaType?: AreaTypeKeys,
  selectedAreaData?: AreaWithRelations[]
): AreaTypeKeys => {
  if (selectedAreaType) return selectedAreaType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].areaType.key as AreaTypeKeys;

  return 'england';
};
