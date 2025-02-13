import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { AreaTypes } from '@/mock/data/areaType';

export const determineSelectedGroupType = (
  selectedGroupType?: AreaTypes,
  selectedAreaData?: AreaWithRelations[]
): AreaTypes | undefined => {
  if (selectedGroupType) return selectedGroupType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].parent?.areaType.key as AreaTypes;
};
