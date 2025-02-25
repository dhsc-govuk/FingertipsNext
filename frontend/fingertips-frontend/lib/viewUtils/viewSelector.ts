import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export interface IViews {
  oneArea?: boolean;
  twoAreas?: boolean;
  threeOrMoreAreas?: boolean;
  allAreasInGroup?: boolean;
}
export function viewSelector(): IViews {
  return {};
}
