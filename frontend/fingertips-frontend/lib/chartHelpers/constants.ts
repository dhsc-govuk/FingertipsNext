import { Area } from '@/generated-sources/ft-api-client';
import { englandAreaType } from '../areaFilterHelpers/areaType';

export const areaCodeForEngland = 'E92000001';
export const englandAreaString = 'England';
export const indicatorIdForPopulation = 337;

export const DEFAULT_ENGLAND_AREA: Area = {
  code: areaCodeForEngland,
  name: 'England',
  areaType: englandAreaType,
};
