import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { AllApplicableAreaTypes } from './determineApplicableGroupTypes';

export const determineSelectedGroupType = (
  selectedGroupType?: AllApplicableAreaTypes,
  selectedAreaData?: AreaWithRelations[]
): AllApplicableAreaTypes | undefined => {
  if (selectedGroupType) return selectedGroupType;

  if (selectedAreaData && selectedAreaData.length > 0)
    return selectedAreaData[0].parent?.areaType;
};
