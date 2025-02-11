import { AreaType, AreaWithRelations } from '@/generated-sources/ft-api-client';

export const determineSelectedAreaType = (
  selectedAreaType?: string,
  selectedAreaData?: AreaWithRelations[],
  availableAreaTypes?: AreaType[]
): string | undefined => {
  if (selectedAreaType) return selectedAreaType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].areaType;

  if (availableAreaTypes && availableAreaTypes.length > 0)
    return availableAreaTypes[0].name;
};
