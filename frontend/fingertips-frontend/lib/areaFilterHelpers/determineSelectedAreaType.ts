import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { AreaTypes } from '@/mock/data/areaType';

export const determineSelectedAreaType = (
  selectedAreaType?: AreaTypes,
  selectedAreaData?: AreaWithRelations[]
): AreaTypes => {
  if (selectedAreaType) return selectedAreaType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].areaType.key as AreaTypes;

  return 'england';
};
