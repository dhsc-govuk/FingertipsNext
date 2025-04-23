import { Area } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '../chartHelpers/constants';

export const determineSelectedGroup = (
  selectedGroup?: string,
  availableGroups?: Area[]
): string => {
  if (selectedGroup) return selectedGroup;

  if (availableGroups && availableGroups.length > 0) {
    return availableGroups[0].code;
  }

  return areaCodeForEngland;
};
