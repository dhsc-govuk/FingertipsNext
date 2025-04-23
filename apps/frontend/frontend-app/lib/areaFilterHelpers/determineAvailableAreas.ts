import { Area, AreaWithRelations } from '@/generated-sources/ft-api-client';
import { AreaTypeKeys, englandAreaType } from './areaType';
import { englandArea } from '@/mock/data/areas/englandAreas';

export const determineAvailableAreas = (
  selectedAreaType: AreaTypeKeys,
  availableArea?: AreaWithRelations
): Area[] => {
  if (selectedAreaType === englandAreaType.key) return [englandArea];

  return availableArea?.children ?? [];
};
