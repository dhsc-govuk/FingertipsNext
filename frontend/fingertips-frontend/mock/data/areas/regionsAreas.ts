import { Area } from '@/generated-sources/ft-api-client';
import { regionsAreaType } from '../../../lib/areaFilterHelpers/areaType';

export const northEastRegion: Area = {
  code: 'E12000001',
  name: 'North East region (statistical)',
  areaType: regionsAreaType,
};

export const northWestRegion: Area = {
  code: 'E12000002',
  name: 'North West region (statistical)',
  areaType: regionsAreaType,
};

export const yorkshireAndHumberRegion: Area = {
  code: 'E12000003',
  name: 'Yorkshire and the Humber region (statistical)',
  areaType: regionsAreaType,
};

export const allRegions = [
  northEastRegion,
  northWestRegion,
  yorkshireAndHumberRegion,
];
