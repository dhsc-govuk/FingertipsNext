import { Area } from '@/generated-sources/ft-api-client';
import { englandAreaType } from '../../../lib/areaFilterHelpers/areaType';

export const englandArea: Area = {
  code: 'E92000001',
  name: 'England',
  areaType: englandAreaType,
};

export const allEngland = [englandArea];
